"""
Savings-event ingest & query API.

• POST   /events/            → idempotent single insert
• POST   /events/batch       → bulk insert (≤5 000 rows, duplicate-safe)
• GET    /events/            → paginated list with filters + ordering

Covered roadmap
───────────────
✓ Sprint-3 – token auth, idempotent hash, pagination, bulk, SlowAPI limits
✓ Sprint-4 – structlog JSON logs, Prometheus metrics
✓ Sprint-5 – rich filters (project_id, feature, date range), ready for Alembic
"""

from __future__ import annotations

import hashlib
from datetime import datetime
from typing import List, Sequence
from uuid import UUID, uuid4

import structlog
from fastapi import (
    APIRouter,
    Body,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from typing import Annotated
from fastapi_pagination import Page, Params, paginate
from prometheus_client import Counter, Histogram
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.deps import get_db
from ..core.ratelimit import limiter
from ..models import SavingEvent
SavingEvent.model_rebuild()
from .tokens import verify_project_token, ProjectToken  # auth dependency

router = APIRouter(prefix="/events", tags=["events"])

log = structlog.get_logger()

EVENT_INGEST_CNT = Counter(
    "saving_events_ingested_total", "Number of events ingested", ["mode", "status"]
)
EVENT_INGEST_LAT = Histogram(
    "saving_event_ingest_seconds", "Latency for single event ingest"
)


# ─────────────── helper: deterministic hash ────────────────
def _event_hash(e: SavingEvent) -> str:
    m = hashlib.sha1()
    m.update(str(e.project_id).encode())
    m.update(e.feature.encode())
    m.update(f"{e.kwh:.6f}{e.co2:.6f}{e.usd:.6f}".encode())
    # round to second for 2-second idempotency window
    m.update(e.created_at.replace(microsecond=0).isoformat().encode())
    return m.hexdigest()


async def _dedupe(
    db: AsyncSession,
    events: Sequence[SavingEvent],
) -> list[SavingEvent]:
    if not events:
        return []

    hashes = [_event_hash(e) for e in events]
    stmt = select(SavingEvent.id).where(SavingEvent.id.in_(hashes))
    existing = {row for row in (await db.scalars(stmt)).all()}
    return [ev for ev, h in zip(events, hashes) if h not in existing]


# ─────────────── POST /events/ (single) ────────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("120/minute")
async def create_event(
    payload: SavingEvent,
    request: Request,  # noqa: D401
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """
    Insert a SavingEvent.

    Idempotent: same payload within ~2 s is silently accepted as duplicate.
    """
    payload.created_at = datetime.utcnow()
    ev_hash = _event_hash(payload)
    payload.id = UUID(ev_hash[:32])  # truncate SHA-1 to UUID-ish identifier

    if await db.get(SavingEvent, payload.id):
        EVENT_INGEST_CNT.labels("single", "duplicate").inc()
        return {"id": payload.id}

    with EVENT_INGEST_LAT.time():
        db.add(payload)
        await db.commit()

    EVENT_INGEST_CNT.labels("single", "ok").inc()
    log.info("event.ingest.ok", id=str(payload.id))
    return {"id": payload.id}


# ─────────────── POST /events/batch ────────────────
@router.post("/batch", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("60/minute")
async def batch_events(
    request: Request,  # noqa: D401
    payload: List[SavingEvent] = Body(..., description="≤ 5 000 SavingEvent objects"),
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    if len(payload) > 5_000:
        raise HTTPException(400, "batch too large (max 5 000)")

    now = datetime.utcnow()
    for ev in payload:
        ev.created_at = now
        ev.id = UUID(_event_hash(ev)[:32])

    to_insert = await _dedupe(db, payload)
    if to_insert:
        db.add_all(to_insert)
        await db.commit()

    EVENT_INGEST_CNT.labels("batch", "ok").inc(len(to_insert))
    log.info(
        "event.ingest.batch",
        received=len(payload),
        inserted=len(to_insert),
        duplicate=len(payload) - len(to_insert),
    )
    return {
        "received": len(payload),
        "inserted": len(to_insert),
        "duplicate": len(payload) - len(to_insert),
    }


# ─────────────── GET /events/ (list) ────────────────
@router.get("/", response_model=Page[SavingEvent])
@limiter.limit("120/minute")
async def list_events(
    request: Request,  # noqa: D401
    params: Annotated[Params, Depends()],
    project_id: UUID | None = Query(None),
    feature: str | None = Query(None),
    since: datetime | None = Query(None),
    until: datetime | None = Query(None),
    order: str = Query("created_at", regex="^(created_at|kwh|co2|usd)$"),
    direction: str = Query("desc", regex="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Paginated list of events with filters, search & ordering."""
    stmt = select(SavingEvent)

    if project_id:
        stmt = stmt.where(SavingEvent.project_id == project_id)
    if feature:
        stmt = stmt.where(SavingEvent.feature.ilike(f"%{feature}%"))
    if since:
        stmt = stmt.where(SavingEvent.created_at >= since)
    if until:
        stmt = stmt.where(SavingEvent.created_at <= until)

    col = getattr(SavingEvent, order)
    stmt = stmt.order_by(col.desc() if direction == "desc" else col)

    events = (await db.scalars(stmt)).all()
    return paginate(events, params)
