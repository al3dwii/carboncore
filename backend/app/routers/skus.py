from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession              # ← use SQLAlchemy’s session
from sqlmodel import select

from ..models import Sku
from ..core.deps import get_db
from ..core.ratelimit import limiter

# pagination helpers
from fastapi_pagination import Page, paginate

router = APIRouter(prefix="/skus", tags=["skus"])

# ────────────────────────────────────────────────────────────────
# READ  ▸  paginated list
# ────────────────────────────────────────────────────────────────
@router.get("/", response_model=Page[Sku])
@limiter.limit("120/minute")
async def list_skus(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Paginated list of SKUs (rate-limited 120 req/min)."""
    scalars = await db.scalars(select(Sku))
    return paginate(scalars.all())


# ────────────────────────────────────────────────────────────────
# READ  ▸  single SKU
# ────────────────────────────────────────────────────────────────
@router.get("/{sku_id}", response_model=Sku)
@limiter.limit("120/minute")
async def get_sku(
    sku_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    sku = await db.get(Sku, sku_id)
    if not sku:
        raise HTTPException(status_code=404, detail="SKU not found")
    return sku


# ────────────────────────────────────────────────────────────────
# CREATE ▸  add a new SKU
# ────────────────────────────────────────────────────────────────
@router.post("/", response_model=Sku, status_code=status.HTTP_201_CREATED)
@limiter.limit("60/minute")
async def create_sku(
    payload: Sku,                            # full Sku body from the client
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Insert a new SKU. Rejects duplicates (409)."""
    if await db.get(Sku, payload.id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"SKU '{payload.id}' already exists",
        )

    db.add(payload)
    await db.commit()
    await db.refresh(payload)
    return payload
