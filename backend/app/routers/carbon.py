"""
Live CO₂-intensity endpoint.

GET /carbon?zone=DE
───────────────────
Returns real-time grid intensity (gCO₂ / kWh) for the requested
ElectricityMaps / WattTime zone.  Data is fetched via
`services.carbon_feed.fetch_intensity`, which already handles retry
and fallback between the two providers.

Road-map coverage
─────────────────
✓ Sprint-3 – token-auth + 30 req/s SlowAPI rate-limit  
✓ Sprint-4 – structlog JSON logs, Prometheus metrics  
✓ Sprint-5 – stable contract, no further code changes expected
"""

from __future__ import annotations

from datetime import datetime

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from prometheus_client import Counter, Histogram
from ..core.ratelimit import limiter

from ..services.carbon_feed import fetch_intensity
from .tokens import verify_project_token, ProjectToken  # auth dependency

router = APIRouter(prefix="/carbon", tags=["carbon"])
log = structlog.get_logger()

CARBON_REQ_CNT = Counter(
    "carbon_requests_total",
    "Number of /carbon requests",
    ["status"],  # ok | error
)
CARBON_REQ_LAT = Histogram(
    "carbon_request_seconds",
    "Latency for /carbon endpoint",
)


@router.get("/", summary="Live CO₂ intensity (gCO₂/kWh)")
@limiter.limit("30/second")
async def carbon_intensity(  # noqa: D401
    request: Request,
    zone: str = Query(..., min_length=2, max_length=10, description="Grid zone code"),
    token: ProjectToken = Depends(verify_project_token),
):
    """
    Return current grid-intensity for *zone*.

    • Auth-header required (`x-project-token`).  
    • 30 requests / second per token (SlowAPI).  
    • 502 on provider failure after retries/fallback.
    """
    with CARBON_REQ_LAT.time():
        try:
            value = await fetch_intensity(zone)
        except Exception as exc:  # pragma: no cover
            CARBON_REQ_CNT.labels("error").inc()
            log.warning(
                "carbon.fetch.error",
                zone=zone,
                error=str(exc),
                token=token.id.hex,
            )
            raise HTTPException(502, "feed unavailable") from exc

    CARBON_REQ_CNT.labels("ok").inc()
    log.info(
        "carbon.fetch.ok",
        zone=zone,
        gco2_per_kwh=value,
        token=token.id.hex,
    )
    return {
        "zone": zone.upper(),
        "gco2_per_kwh": round(value, 1),
        "fetched_at": datetime.utcnow().isoformat(timespec="seconds") + "Z",
    }
