from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlmodel import select, or_, asc, desc
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi_pagination import Page, Params, paginate

from ..models import Sku
from ..core.deps import get_db
from ..core.ratelimit import limiter

router = APIRouter(prefix="/skus", tags=["skus"])
_VALID_ORDER = {"id", "provider", "updated_at", "price_per_hour"}  # updated_at!

# ───────── list ──────────────────────────────────────────────────
@router.get("/", response_model=Page[Sku])
@limiter.limit("120/minute")
async def list_skus(
    request: Request,
    provider: str | None = None,
    q: str | None = None,
    order: str = "updated_at",
    direction: str = "desc",
    params: Params = Depends(),
    db: AsyncSession = Depends(get_db),
):
    if order not in _VALID_ORDER:
        raise HTTPException(status_code=400, detail="invalid order field")

    stmt = select(Sku)
    if provider:
        stmt = stmt.where(Sku.provider == provider)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Sku.id.ilike(like), Sku.provider.ilike(like)))

    stmt = stmt.order_by((desc if direction.lower() == "desc" else asc)(getattr(Sku, order)))
    result = await db.execute(stmt)
    return paginate(result.scalars().all(), params)

# ───────── get single ───────────────────────────────────────────
@router.get("/{sku_id}", response_model=Sku)
@limiter.limit("120/minute")
async def get_sku(sku_id: str, request: Request, db: AsyncSession = Depends(get_db)):
    sku = await db.get(Sku, sku_id)
    if not sku:
        raise HTTPException(status_code=404, detail="SKU not found")
    return sku

# ───────── create ───────────────────────────────────────────────
@router.post("/", response_model=Sku, status_code=status.HTTP_201_CREATED)
@limiter.limit("60/minute")
async def create_sku(payload: Sku, request: Request, db: AsyncSession = Depends(get_db)):
    if await db.get(Sku, payload.id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"SKU '{payload.id}' exists")
    db.add(payload)
    await db.commit()
    await db.refresh(payload)
    return payload
