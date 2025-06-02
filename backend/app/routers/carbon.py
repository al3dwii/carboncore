from fastapi import APIRouter, Query
from ..services.carbon_feed import get_intensity

router = APIRouter(prefix="/carbon", tags=["carbon"])

@router.get("/")
async def carbon(region: str = Query(..., max_length=20)):
    return {"region": region, "gco2_kwh": await get_intensity(region)}
