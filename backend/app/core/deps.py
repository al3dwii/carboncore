"""Async DB helpers + table bootstrap."""
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlmodel import SQLModel

from .settings import get_settings

settings = get_settings()

# 1 engine ──────────────────────────────────
engine: AsyncEngine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)

# 2 session factory ─────────────────────────
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# 3 FastAPI dependency ──────────────────────
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    session = SessionLocal()
    try:
        yield session
    finally:
        await session.close()


# 4 Sprint-2 bootstrap helper ───────────────
async def init_db() -> None:
    """Create tables if they don’t exist (idempotent)."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
