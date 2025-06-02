from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from ..models import SavingEvent
from ..core.deps import get_db

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/")
async def add_event(event: SavingEvent, db: AsyncSession = Depends(get_db)):
    db.add(event)
    await db.commit()
    return {"status": "ok", "id": event.id}

@router.get("/")
async def get_events(project_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.exec(
        select(SavingEvent).where(SavingEvent.project_id == project_id)
    )
    return result.all()
