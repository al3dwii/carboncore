"""
SKU catalogue API.

Endpoints
─────────
GET    /skus/            → paginated list with filters + ordering
GET    /skus/{id}        → fetch single SKU
POST   /skus/            → create SKU (409 on duplicate)

Road-map coverage
─────────────────
✓ Sprint-3 – pagination, filters, ordering, bcrypt-token auth, rate-limits
✓ Sprint-4 – structlog logs + Prometheus counters
✓ Sprint-5 – no further edits expected (fields & filters already stable)
"""

from __future__ import annotations

import structlog
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    status,
)
from fastapi_pagination import Page, Params, paginate
from prometheus_client import Counter
from slowapi import limiter
from sqlmodel import asc, desc, or_, select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.deps import get_db
from ..models import Sku
from .tokens import verify_project_token, ProjectToken  # auth dependency

router = APIRouter(prefix="/skus", tags=["skus"])
log = structlog.get_logger()

SKU_REQ_CNT = Counter(
    "sku_requests_total",
    "Count of SKU router calls",
    ["operation", "status"],
)

_VALID_ORDER = {"id", "provider", "updated_at", "price_per_hour"}


# ─────────────────────── helpers ────────────────────────
def _order_clause(col: str, direction: str):
    column = getattr(Sku, col)
    return desc(column) if direction == "desc" else asc(column)


# ─────────────────────── routes ─────────────────────────
@router.get("/", response_model=Page[Sku])
@limiter.limit("120/minute")
async def list_skus(
    request: Request,                         # noqa: D401
    params: Params = Depends(),
    provider: str | None = Query(None),
    q: str | None = Query(
        None,
        description="Fuzzy search over id / provider",
    ),
    order: str = Query(
        "updated_at",
        description=f"Sort field (one of {', '.join(_VALID_ORDER)})",
    ),
    direction: str = Query("desc", regex="^(asc|desc)$"),
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Paginated list of SKUs with filters, search & ordering."""
    if order not in _VALID_ORDER:
        raise HTTPException(status_code=400, detail="invalid order field")

    stmt = select(Sku)
    if provider:
        stmt = stmt.where(Sku.provider == provider)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Sku.id.ilike(like), Sku.provider.ilike(like)))

    stmt = stmt.order_by(_order_clause(order, direction))

    result = await db.scalars(stmt)
    SKU_REQ_CNT.labels("list", "ok").inc()
    return paginate(result.all(), params)


@router.get("/{sku_id}", response_model=Sku)
@limiter.limit("120/minute")
async def get_sku(
    sku_id: str,
    request: Request,                         # noqa: D401
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Fetch a single SKU by its id."""
    sku = await db.get(Sku, sku_id)
    if not sku:
        SKU_REQ_CNT.labels("get", "not_found").inc()
        raise HTTPException(status_code=404, detail="SKU not found")
    SKU_REQ_CNT.labels("get", "ok").inc()
    return sku


@router.post("/", response_model=Sku, status_code=status.HTTP_201_CREATED)
@limiter.limit("60/minute")
async def create_sku(
    payload: Sku,
    request: Request,                         # noqa: D401
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Insert a new SKU; duplicate id → 409 Conflict."""
    if await db.get(Sku, payload.id):
        SKU_REQ_CNT.labels("create", "duplicate").inc()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"SKU '{payload.id}' already exists",
        )

    db.add(payload)
    await db.commit()
    await db.refresh(payload)
    SKU_REQ_CNT.labels("create", "ok").inc()
    log.info("sku.created", id=payload.id, provider=payload.provider)
    return payload
