"""Async DB helpers + table bootstrap."""

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlmodel import SQLModel, select

from app.models import ProjectToken, EventType

from .settings import get_settings

settings = get_settings()

# 1 engine ──────────────────────────────────
engine: AsyncEngine = create_async_engine(
    settings.DATABASE_URL, echo=False, future=True
)

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

    # Seed the default "demo" token used by the tests and a default event type
    async with SessionLocal() as db:
        existing = await db.scalar(
            select(ProjectToken).where(ProjectToken.name == "demo")
        )
        if not existing:
            db.add(ProjectToken(name="demo", token_hash=ProjectToken.hash("demo")))

        default_et = await db.scalar(select(EventType).where(EventType.id == "default"))
        if not default_et:
            db.add(EventType(id="default", json_schema={}))

        await db.commit()
