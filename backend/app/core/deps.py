from functools import lru_cache
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    create_async_engine,
    async_sessionmaker,
)
from sqlmodel import SQLModel
from .settings import get_settings


settings = get_settings()

# 1) async engine ---------------------------------------------
engine: AsyncEngine = create_async_engine(
    settings.database_url, echo=False, future=True
)

# 2) session factory ------------------------------------------
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# 3) FastAPI dependency ---------------------------------------
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session
