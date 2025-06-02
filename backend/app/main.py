import uvicorn
from fastapi import Depends, FastAPI, Header, HTTPException, status
from sqlmodel import SQLModel, select

from .core.settings import get_settings
from .core.deps import engine, get_db
from .core.ratelimit import attach as attach_rate_limiter
from .routers import skus, carbon, events
from .models import ProjectToken

# global pagination
from fastapi_pagination import add_pagination

settings = get_settings()
app = FastAPI(title="CarbonCore v0.1")

# ── rate-limit middleware & 429 handler ───────────────────────────
attach_rate_limiter(app)            # installs `limiter` + default JSON 429

# ── token-auth dependency ─────────────────────────────────────────
async def auth(
    token: str = Header(..., alias=settings.project_token_header),
    db=Depends(get_db),
):
    """Simple project-token check (bcrypt hash match)."""
    stmt = select(ProjectToken)
    for row in (await db.exec(stmt)).all():
        if ProjectToken.verify(token, row.token_hash):
            return
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired project token",
    )

# ── routers ───────────────────────────────────────────────────────
app.include_router(skus.router, dependencies=[Depends(auth)])
app.include_router(carbon.router)
app.include_router(events.router, dependencies=[Depends(auth)])

# ── DB schema bootstrap on startup ────────────────────────────────
@app.on_event("startup")
async def _init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

# ── turn on pagination globally ───────────────────────────────────
add_pagination(app)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
