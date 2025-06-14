from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.deps import get_db

router = APIRouter()

@router.post("/hooks/ecolabel")
async def record_ecolabel(evt: dict, db: AsyncSession = Depends(get_db)):
    await db.execute(
        text("INSERT INTO event (event_type_id, meta) VALUES (:t, :m)"),
        {"t": "ecolabel_view", "m": evt},
    )
    await db.commit()
    return {"status": "ok"}
