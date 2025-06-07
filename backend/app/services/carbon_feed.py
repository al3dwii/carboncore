"""
Resilient CO₂-intensity adapter for CarbonCore
──────────────────────────────────────────────
• Primary provider  : ElectricityMaps  (paid / live)
• Fallback (tests)  : in-process stub
• Tenacity retries  : exponential back-off
• Redis 5-minute cache to spare rate-limits
• Prometheus metrics (Counter + Histogram)
• Structlog JSON events (httpx is OTEL-instrumented)
"""

from __future__ import annotations

# ─────────────── stdlib / typing ───────────────
import os
from abc import ABC, abstractmethod
from typing import Callable, Final

# ────────────────── 3rd-party ──────────────────
import httpx
import redis.asyncio as redis
import structlog
from fastapi import HTTPException
from prometheus_client import Counter, Histogram
from tenacity import RetryError, retry, stop_after_attempt, wait_exponential

# ────────────────── internal ───────────────────
from app.core.settings import settings

# ────────────────── Redis client ───────────────
if settings.REDIS_URL.startswith("fakeredis://"):
    import fakeredis.aioredis as fakeredis            # type: ignore
    _REDIS: Final = fakeredis.FakeRedis(decode_responses=True)
else:
    _REDIS: Final = redis.from_url(settings.REDIS_URL, decode_responses=True)

# ────────────────── Telemetry ───────────────────
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

# ────────────────── Redis cache ────────────────
_CACHE_TTL = 300  # seconds


async def _cache_get(zone: str) -> float | None:
    raw = await _REDIS.get(f"carbon:{zone.upper()}")
    return float(raw) if raw else None


async def _cache_set(zone: str, value: float) -> None:
    await _REDIS.setex(f"carbon:{zone.upper()}", _CACHE_TTL, value)


# ────────────────── Provider base-class ────────
class BaseAdapter(ABC):
    name: str
    timeout: int = 8

    @abstractmethod
    async def intensity(self, zone: str) -> float: ...

    async def _observe(self, zone: str, fn: Callable[[str], float]) -> float:
        """Add Prometheus timing / error counters around *fn*."""
        with _FEED_LAT.labels(self.name, zone).time():
            try:
                val = await fn(zone)
                _FETCH_TOTAL.labels(self.name, "success").inc()
                return val
            except Exception as exc:          # noqa: BLE001
                _FEED_ERR.labels(
                    self.name, zone, exc.__class__.__name__
                ).inc()
                _FETCH_TOTAL.labels(self.name, "error").inc()
                raise


# ─────────────── Live adapter (only if token set) ───────────────
if os.getenv("ELECTRICITYMAPS_TOKEN", "").lower() not in ("", "dummy-token"):
    # import lazily to avoid dependency weight in CI
    from ._live_adapter import ElectricityMapsAdapter  # noqa: WPS433

    _PRIMARY = ElectricityMapsAdapter()

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=0.5))
    async def fetch_intensity(zone: str) -> int:
        """Live call - ElectricityMaps."""
        cached = await _cache_get(zone)
        if cached is not None:
            return int(cached)

        try:
            value = await _PRIMARY.get_intensity(zone)
        except (httpx.HTTPError, RetryError) as exc:
            log.warning("carbon_feed.error", zone=zone, err=str(exc))
            raise HTTPException(status_code=502, detail="upstream error") from exc

        await _cache_set(zone, value)
        return int(value)

# ─────────────── Stub adapter (tests / dev) ───────────────
else:

    async def fetch_intensity(zone: str) -> int:
        """Offline stub used in unit-tests & local dev."""
        zone = zone.upper()
        # simulate a “bad zone” validation error
        if zone == "ZZZ":
            raise HTTPException(status_code=400, detail="bad zone")

        # return a constant, easy-to-assert value
        return 406
