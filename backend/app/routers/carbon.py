from fastapi import APIRouter, Depends, HTTPException, Request
from ..services.carbon_feed import fetch_intensity
from ..core.ratelimit import limiter

router = APIRouter(prefix="/carbon", tags=["carbon"])


@router.get("/", summary="Live CO₂ intensity (gCO₂/kWh)")
@limiter.limit("30/second")
async def carbon_intensity(  # noqa: D401
    request: Request,
    zone: str,
):
    """Proxy ElectricityMaps / WattTime with retry & fallback."""
    try:
        value = await fetch_intensity(zone)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"zone": zone, "gco2_per_kwh": value}
