"""
Resilient CO₂-intensity adapter for CarbonCore
──────────────────────────────────────────────
• Primary provider  : ElectricityMaps
• Secondary fallback: WattTime
• Tenacity retries  : exponential back-off (Sprint-3)
• Redis 5-minute cache to spare rate-limits
• Prometheus metrics (Counter + Histogram) (Sprint-4)
• Structlog JSON events, httpx is OTEL-instrumented automatically
• No hard-coded creds – all read from `core.settings` (Sprint-5 ready)

After copying, rebuild with `make dev`; you shouldn’t need to touch this file
again before v0.1 GA.
"""

from __future__ import annotations

import asyncio
from abc import ABC, abstractmethod
from typing import Callable, Final

import httpx
import redis.asyncio as redis
import structlog
from prometheus_client import Counter, Histogram
from tenacity import RetryError, retry, stop_after_attempt, wait_exponential

from app.core.settings import settings

if settings.REDIS_URL.startswith("fakeredis://"):
    import fakeredis.aioredis
    _REDIS: Final = fakeredis.aioredis.FakeRedis(decode_responses=True)
else:
    _REDIS: Final = redis.from_url(settings.REDIS_URL, decode_responses=True)

# ───────────────────────── Observability ───────────────────────
log = structlog.get_logger()

_FEED_LAT = Histogram(
    "carbon_feed_seconds",
    "Latency of upstream carbon-intensity requests",
    ["provider", "zone"],
)
_FEED_ERR = Counter(
    "carbon_feed_errors_total",
    "Upstream feed errors (after retries)",
    ["provider", "zone", "type"],
)
_FETCH_TOTAL = Counter(
    "carbon_feed_requests_total",
    "Total upstream requests (all outcomes)",
    ["provider", "status"],
)

# ───────────────────────── Redis cache ─────────────────────────
_CACHE_TTL = 300  # seconds


async def _cache_get(zone: str) -> float | None:
    raw = await _REDIS.get(f"carbon:{zone}")
    return float(raw) if raw else None


async def _cache_set(zone: str, value: float) -> None:
    await _REDIS.setex(f"carbon:{zone}", _CACHE_TTL, value)


# ───────────────── Provider base-class ─────────────────────────
class BaseAdapter(ABC):
    name: str
    timeout: int = 8

    @abstractmethod
    async def intensity(self, zone: str) -> float: ...

    async def _observe(self, zone: str, fn: Callable[[str], float]) -> float:
        """Prometheus latency wrapper."""
        with _FEED_LAT.labels(self.name, zone).time():
            try:
                val = await fn(zone)
                _FETCH_TOTAL.labels(self.name, "success").inc()
                return val
            except Exception as exc:  # noqa: BLE001
                _FEED_ERR.labels(self.name, zone, exc.__class__.__name__).inc()
                _FETCH_TOTAL.labels(self.name, "error").inc()
                raise


# ───────────────── ElectricityMaps adapter ─────────────────────
class ElectricityMapsAdapter(BaseAdapter):
    name = "electricitymaps"
    _URL = "https://api.electricitymap.org/v3/zone/{zone}"

    def __init__(self) -> None:
        self._client = httpx.AsyncClient(
            headers={"auth-token": settings.ELECTRICITYMAPS_API_KEY or ""},
            timeout=self.timeout,
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.3))
    async def _call(self, zone: str) -> float:
        r = await self._client.get(self._URL.format(zone=zone))
        r.raise_for_status()
        return r.json()["zone_data"]["co2intensity"]

    async def intensity(self, zone: str) -> float:
        return await self._observe(zone, self._call)


# ────────────────────── WattTime adapter ───────────────────────
class WattTimeAdapter(BaseAdapter):
    name = "watttime"
    _LOGIN = "https://api2.watttime.org/v2/login"
    _URL   = "https://api2.watttime.org/v2/index?ba={zone}"

    def __init__(self) -> None:
        self._client = httpx.AsyncClient(timeout=self.timeout)
        self._token: str | None = None

    async def _ensure_token(self) -> None:
        if self._token:
            return
        r = await self._client.post(
            self._LOGIN,
            json={
                "username": settings.WATTTIME_USER,
                "password": settings.WATTTIME_PASS,
            },
        )
        r.raise_for_status()
        self._token = r.json()["token"]

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.3))
    async def _call(self, zone: str) -> float:
        await self._ensure_token()
        r = await self._client.get(
            self._URL.format(zone=zone),
            headers={"Authorization": f"Bearer {self._token}"},
        )
        r.raise_for_status()
        return r.json()["carbonIntensity"]

    async def intensity(self, zone: str) -> float:
        return await self._observe(zone, self._call)


# ─────────── Adapter registry (singletons) ─────────────────────
_PRIMARY   = ElectricityMapsAdapter()
_SECONDARY = WattTimeAdapter()
_PROVIDERS: Final[list[BaseAdapter]] = [_PRIMARY, _SECONDARY]

# ───────────────────── Public API function ─────────────────────
async def fetch_intensity(zone: str) -> float:  # noqa: D401
    """
    Return gCO₂/kWh for *zone* with caching, retries and provider fallback.
    Raises RuntimeError if both providers ultimately fail.
    """
    zone = zone.upper()

    if (cached := await _cache_get(zone)) is not None:
        log.debug("carbon.cache.hit", zone=zone, value=cached)
        return cached

    errors: list[str] = []

    for adapter in _PROVIDERS:
        try:
            value = await adapter.intensity(zone)
            await _cache_set(zone, value)
            log.info("carbon.fetch.ok", provider=adapter.name, zone=zone, value=value)
            return value
        except RetryError as exc:
            msg = f"{adapter.name} retry_error: {exc}"
        except Exception as exc:  # noqa: BLE001
            msg = f"{adapter.name}: {exc}"
        log.warning("carbon.fetch.error", provider=adapter.name, zone=zone, err=msg)
        errors.append(msg)

    raise RuntimeError(" ; ".join(errors))


# Legacy alias
get_intensity = fetch_intensity


# ───────────────────── CLI quick-check ─────────────────────────
if __name__ == "__main__":  # pragma: no cover
    import sys

    print(asyncio.run(fetch_intensity(sys.argv[1] if len(sys.argv) > 1 else "DE")))
