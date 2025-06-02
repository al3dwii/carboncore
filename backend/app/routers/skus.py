from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from ..models import Sku
from ..core.deps import get_db

router = APIRouter(prefix="/skus", tags=["skus"])

@router.get("/")
async def list_skus(db: AsyncSession = Depends(get_db)):
    result = await db.exec(select(Sku))
    return result.all()

@router.get("/{sku_id}")
async def get_sku(sku_id: str, db: AsyncSession = Depends(get_db)):
    sku = await db.get(Sku, sku_id)
    if not sku:
        raise HTTPException(404)
    return sku
