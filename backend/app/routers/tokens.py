"""
Project-token CRUD and authentication dependency.

✓ Sprint-3  – bcrypt-hashed tokens, rotation endpoint, rate-limited
✓ Sprint-4  – Prometheus counter & structlog JSON logs
✓ Sprint-5  – Header name read from settings, ready for blue/green

Endpoints
─────────
POST   /tokens/           → create / rotate (returns clear-text token **once**)
GET    /tokens/           → paginated list (hashed value never exposed)
DELETE /tokens/{id}       → revoke

Dependency
──────────
verify_project_token() → returns ProjectToken record or HTTP 401.
"""

from __future__ import annotations

import secrets
from datetime import datetime
from uuid import UUID

import structlog
from fastapi import (
    APIRouter,
    Depends,
    Header,
    HTTPException,
    Request,
    status,
)
from typing import Annotated
from fastapi_pagination import Page, Params, paginate
from passlib.hash import bcrypt
from prometheus_client import Counter
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.deps import get_db
from ..core.ratelimit import limiter
from ..core.settings import settings
from ..models import ProjectToken

# ────────── logging & metrics ──────────
log = structlog.get_logger()

_AUTH_FAIL_COUNTER: Counter = Counter(
    "project_token_auth_fail_total",
    "Number of failed project-token authentications",
)

# ────────── FastAPI router ──────────
router = APIRouter(prefix="/tokens", tags=["tokens"])

TokenHeader = Header(
    alias=settings.PROJECT_TOKEN_HEADER,
    description="Project API token",
)

# ────────── auth dependency ──────────
async def verify_project_token(
    token_header: str = TokenHeader,
    db: AsyncSession = Depends(get_db),
) -> ProjectToken:
    """Return matching ProjectToken or raise 401."""
    stmt = select(ProjectToken)
    for rec in (await db.scalars(stmt)).all():
        if ProjectToken.verify(token_header, rec.token_hash):
            return rec
    _AUTH_FAIL_COUNTER.inc()
    log.warning("auth.token.invalid")
    raise HTTPException(status_code=401, detail="invalid token")

# ────────── CRUD endpoints ──────────
@router.post("/", status_code=status.HTTP_201_CREATED)
@limiter.limit("30/minute")
async def create_token(
    name: str,
    request: Request,                     # noqa: D401  (needed for SlowAPI)
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),   # only an existing token can rotate
):
    """
    Create (or rotate) a project token.

    Returns the **clear-text token once**; only the bcrypt hash is stored.
    """
    raw = secrets.token_urlsafe(32)
    record = ProjectToken(
        name=name,
        token_hash=bcrypt.hash(raw),
        created_at=datetime.utcnow(),
    )
    db.add(record)
    await db.commit()
    await db.refresh(record)
    log.info("token.created", token_id=str(record.id))
    return {"id": record.id, "token": raw, "created_at": record.created_at}


@router.get("/", response_model=Page[ProjectToken])
@limiter.limit("60/minute")
async def list_tokens(
    request: Request,                     # noqa: D401
    params: Annotated[Params, Depends()],
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    """Paginated list of stored tokens (hashed value is never exposed)."""
    stmt = select(ProjectToken)
    records = (await db.scalars(stmt)).all()
    return paginate(records, params)


@router.delete("/{token_id}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("30/minute")
async def revoke_token(
    token_id: UUID,
    request: Request,                     # noqa: D401
    db: AsyncSession = Depends(get_db),
    _: ProjectToken = Depends(verify_project_token),
):
    stmt = select(ProjectToken).where(ProjectToken.id == token_id)
    rec = (await db.scalars(stmt)).first()
    if not rec:
        raise HTTPException(status_code=404, detail="token not found")
    await db.delete(rec)
    await db.commit()
    log.info("token.revoked", token_id=str(token_id))
