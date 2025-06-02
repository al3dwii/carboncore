from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.deps import get_db
from ..models import ProjectToken

router = APIRouter(prefix="/tokens", tags=["tokens"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_token(name: str, db: AsyncSession = Depends(get_db)) -> str:
    plain = uuid4().hex
    db.add(ProjectToken(name=name, token_hash=ProjectToken.hash(plain)))
    await db.commit()
    return plain


@router.get("/", response_model=list[ProjectToken])
async def list_tokens(db: AsyncSession = Depends(get_db)):
    return (await db.exec(select(ProjectToken))).all()


@router.delete("/{token_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_token(token_id: str, db: AsyncSession = Depends(get_db)):
    token = await db.get(ProjectToken, token_id)
    if not token:
        raise HTTPException(status_code=404, detail="not found")
    await db.delete(token)
    await db.commit()
