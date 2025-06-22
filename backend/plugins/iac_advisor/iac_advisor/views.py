from __future__ import annotations
from typing import List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.core.deps import get_db
from app.models import SavingEvent
from app.routers.tokens import verify_project_token, ProjectToken

router = APIRouter()

@router.get("/recent", response_model=List[SavingEvent])
async def recent(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    stmt = (
        select(SavingEvent)
        .where(SavingEvent.event_type_id == "iac-scan")
        .order_by(SavingEvent.created_at.desc())
        .limit(limit)
    )
    rows = (await db.execute(stmt)).scalars().all()
    return rows

@router.post("/ingest", status_code=status.HTTP_201_CREATED)
async def ingest(
    payload: SavingEvent,
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    payload.event_type_id = "iac-scan"
    from app.routers.events import create_event

    return await create_event(payload, db=db)
