"""
Savings-event ingest & query API
────────────────────────────────
• POST /events/        → idempotent single insert
• POST /events/batch   → bulk insert (≤ 5 000 rows, duplicate-safe)
• GET  /events/        → paginated list with filters + ordering
"""

from __future__ import annotations

# ───────────── stdlib ─────────────
import hashlib
from datetime import datetime
from typing import Sequence, List
from uuid import UUID, uuid4

# ───────────── 3rd-party ─────────────
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
from fastapi_pagination import Page, Params, paginate
from prometheus_client import Counter, Histogram
from pydantic import RootModel       # v2 root-model helper
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

# ───────────── internal ─────────────
from ..core.deps import get_db
from ..core.ratelimit import limiter
from ..models import SavingEvent
from .tokens import verify_project_token, ProjectToken   # auth dependency

# ──────────────────────────────────────────────────────────
# Pydantic v2: proper root-model wrapper around a plain list
# ──────────────────────────────────────────────────────────
class SavingEventList(RootModel[List[SavingEvent]]):      # noqa: D101
    pass

# Resolve *all* forward refs at import-time
SavingEvent.model_rebuild()
SavingEventList.model_rebuild()
Params.model_rebuild()         # ← crucial: avoids ForwardRef('Params') crash

# ───────────── setup ─────────────
router = APIRouter(prefix="/events", tags=["events"])
log = structlog.get_logger()

EVENT_INGEST_CNT = Counter(
    "saving_events_ingested_total", "Number of events ingested", ["mode", "status"]
)
EVENT_INGEST_LAT = Histogram(
    "saving_event_ingest_seconds", "Latency for single event ingest"
)

# ───────────── helpers ─────────────
def _event_hash(ev: SavingEvent) -> str:
    """Deterministic SHA-1 over the event’s identifying fields."""
    m = hashlib.sha1()
    m.update(str(ev.project_id).encode())
    m.update(ev.feature.encode())
    m.update(f"{ev.kwh:.6f}{ev.co2:.6f}{ev.usd:.6f}".encode())
    m.update(ev.created_at.replace(microsecond=0).isoformat().encode())
    return m.hexdigest()


async def _dedupe(db: AsyncSession, events: Sequence[SavingEvent]) -> list[SavingEvent]:
    """Drop events that already exist (id field = truncated SHA-1)."""
    if not events:
        return []

    hashes = [_event_hash(e) for e in events]
    stmt = select(SavingEvent.id).where(SavingEvent.id.in_(hashes))
    existing = {row async for row in db.stream_scalars(stmt)}
    return [ev for ev, h in zip(events, hashes) if h not in existing]

# ───────────── POST /events/ (single) ─────────────
@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("120/minute")
async def create_event(
    payload: SavingEvent,
    request: Request,                        # noqa: ARG001 (needed by SlowAPI)
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Insert **one** `SavingEvent` — idempotent within ~2 s."""
    payload.created_at = datetime.utcnow()
    ev_hash = _event_hash(payload)
    payload.id = UUID(ev_hash[:32])          # SHA-1 → pseudo-UUID

    if await db.get(SavingEvent, payload.id):
        EVENT_INGEST_CNT.labels("single", "duplicate").inc()
        return {"id": payload.id}

    with EVENT_INGEST_LAT.time():
        db.add(payload)
        await db.commit()

    EVENT_INGEST_CNT.labels("single", "ok").inc()
    log.info("event.ingest.ok", id=str(payload.id))
    return {"id": payload.id}

# ───────────── POST /events/batch ─────────────
@router.post("/batch", status_code=status.HTTP_202_ACCEPTED)
@limiter.limit("60/minute")
async def batch_events(
    request: Request,                        # noqa: ARG001
    payload: SavingEventList = Body(..., description="≤ 5 000 SavingEvent objects"),
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    events = payload.root
    if len(events) > 5_000:
        raise HTTPException(400, "batch too large (max 5 000)")

    now = datetime.utcnow()
    for ev in events:
        ev.created_at = now
        ev.id = UUID(_event_hash(ev)[:32])

    to_insert = await _dedupe(db, events)
    if to_insert:
        db.add_all(to_insert)
        await db.commit()

    EVENT_INGEST_CNT.labels("batch", "ok").inc(len(to_insert))
    log.info(
        "event.ingest.batch",
        received=len(events),
        inserted=len(to_insert),
        duplicate=len(events) - len(to_insert),
    )
    return {
        "received": len(events),
        "inserted": len(to_insert),
        "duplicate": len(events) - len(to_insert),
    }

# ───────────── GET /events/ (list) ─────────────
@router.get("/", response_model=Page[SavingEvent])
@limiter.limit("120/minute")
async def list_events(
    request: Request,                        # noqa: ARG001
    params: Params = Depends(),              # ← safe now (no ForwardRefs)
    project_id: UUID | None = Query(None),
    feature: str | None = Query(None),
    since: datetime | None = Query(None),
    until: datetime | None = Query(None),
    order: str = Query(
        "created_at",
        pattern="^(created_at|kwh|co2|usd)$",
        description="Sort column",
    ),
    direction: str = Query(
        "desc", pattern="^(asc|desc)$", description="asc | desc"
    ),
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Paginated list with rich filters & ordering."""
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
