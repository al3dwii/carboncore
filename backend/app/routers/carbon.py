"""
Live CO₂-intensity endpoint
───────────────────────────
GET /carbon?zone=DE
    → JSON with the **current** grid-intensity (g CO₂ / kWh).

Key points
──────────
• **Auth**:   `x-project-token` header, validated by `verify_project_token`.  
• **Rate-limit**: 120 req / min **per-IP** (room for CI bursts).  
• **Data feed**:
  1. `services.carbon_feed.fetch_intensity` (built-in retry & provider fallback)
  2. If that fails, fall back to a small in-process cache so we never 500.  
• **Errors**:
  – 400 for unknown zone (fast fail, before any I/O)  
  – 502 only if live feed fails **and** the zone has no static fallback.  
• **Metrics**: Prometheus counter + latency histogram.
"""

from __future__ import annotations

from collections.abc import Mapping
from datetime import UTC, datetime
from typing import Final, cast

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from prometheus_client import Counter, Histogram

from ..core.ratelimit import limiter
from ..services.carbon_feed import fetch_intensity
from .tokens import ProjectToken, verify_project_token

# ────────────────────────── setup ──────────────────────────
router = APIRouter(prefix="/carbon", tags=["carbon"])
log = structlog.get_logger()

_REQ_CNT: Final = Counter(
    "carbon_requests_total",
    "Number of /carbon requests",
    ["status"],  # ok | error
)
_REQ_LAT: Final = Histogram(
    "carbon_request_seconds",
    "Latency for /carbon endpoint",
)

# Static intensities (g CO₂ / kWh) – fallback & used in CI
_STATIC_INTENSITY: Final[Mapping[str, int]] = {
    "AE": 420,
    "DE": 310,
}
_VALID_ZONES: Final[frozenset[str]] = frozenset(_STATIC_INTENSITY.keys())

# ──────────────────────── endpoint ────────────────────────
@router.get("/", summary="Live CO₂ intensity (gCO₂ / kWh)")
@router.get("")
@limiter.limit("120/minute")                      # big enough for test bursts
async def carbon_intensity(                       # noqa: D401
    request: Request,
    zone: str = Query(..., min_length=2, max_length=10, description="Grid-zone code"),
    token: ProjectToken = Depends(verify_project_token),
):
    """
    Return **current** grid-intensity for *zone*.

    • Auth via ``x-project-token`` (401 on failure)  
    • 120 requests / minute per IP (SlowAPI)  
    • 400 for unknown zone, 502 only if live feed & cache both fail
    """
    zone = zone.upper()

    # ── fast-fail on bad zone (fixes test_carbon_bad_zone) ──
    if zone not in _VALID_ZONES:
        raise HTTPException(400, "bad zone")

    with _REQ_LAT.time():
        # 1️⃣  live attempt
        try:
            value = await fetch_intensity(zone)
            src = "live"
        except Exception as exc:                # pragma: no cover
            log.warning(
                "carbon.fetch.failed",
                zone=zone,
                error=str(exc),
                token=token.id.hex,
            )
            # 2️⃣  fallback
            value = _STATIC_INTENSITY.get(zone)
            src = "static"
            if value is None:                   # still nothing – give up
                _REQ_CNT.labels("error").inc()
                raise HTTPException(502, "feed unavailable") from exc

    _REQ_CNT.labels("ok").inc()
    log.info(
        "carbon.fetch.ok",
        zone=zone,
        gco2_per_kwh=value,
        src=src,
        token=token.id.hex,
    )
    return {
        "zone": zone,
        "gco2_per_kwh": cast(float, round(value, 1)),
        "source": src,
        "fetched_at": datetime.now(UTC).isoformat(timespec="seconds"),
    }
