from fastapi import APIRouter, Depends, Body
from datetime import datetime, timedelta
from sqlalchemy import text
from app.core.deps import SessionLocal

router = APIRouter()

@router.get("/forecast/carbon")
def forecast_carbon(zone: str, hours: int = 24, db=Depends(SessionLocal)):
    q = db.execute(
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
def suggest(job: dict = Body(...), db=Depends(SessionLocal)):
    earliest = datetime.fromisoformat(job["earliest"])
    latest = datetime.fromisoformat(job["latest"])
    q = db.execute(
        text(
            """
        SELECT ts,intensity FROM carbon_forecast
        WHERE zone=:z AND ts BETWEEN :a AND :b
        ORDER BY intensity ASC LIMIT 1
    """
        ),
        dict(z=job["preferred_region"], a=earliest, b=latest),
    ).first()
    return {"start": q.ts, "g_co2_kwh": q.intensity}
