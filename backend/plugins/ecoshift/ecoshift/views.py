from fastapi import APIRouter, Depends, Body
from datetime import datetime, timedelta
from sqlalchemy import text
from app.core.deps import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.get("/forecast/carbon")
async def forecast_carbon(zone: str, hours: int = 24, db: AsyncSession = Depends(get_db)):
    q = await db.execute(
        text(
            """
        SELECT ts, intensity FROM carbon_forecast
        WHERE zone=:z AND ts < now() + (:h||' hours')::interval
        ORDER BY ts
    """
        ),
        dict(z=zone, h=hours),
    )
    return [dict(r) for r in q]

@router.post("/suggest")
async def suggest(job: dict = Body(...), db: AsyncSession = Depends(get_db)):
    earliest = datetime.fromisoformat(job["earliest"])
    latest = datetime.fromisoformat(job["latest"])
    try:
        q = await db.execute(
        text(
            """
        SELECT ts,intensity FROM carbon_forecast
        WHERE zone=:z AND ts BETWEEN :a AND :b
        ORDER BY intensity ASC LIMIT 1
    """
        ),
        dict(z=job["preferred_region"], a=earliest, b=latest),
        )
        row = q.first()
    except Exception:
        row = None
    if not row:
        return {"start": earliest, "g_co2_kwh": 0.0}
    return {"start": row.ts, "g_co2_kwh": row.intensity}
