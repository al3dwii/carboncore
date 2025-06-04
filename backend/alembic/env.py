from __future__ import annotations

# ───── make “backend/” importable as the top-level package `app` ─────
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]          # …/backend
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))
# ─────────────────────────────────────────────────────────────────────

import asyncio
import logging
import os
from logging.config import fileConfig
from typing import Any

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine, async_engine_from_config

from app.models import SQLModel                       # now resolvable
from app.core.settings import settings

# ───────── Alembic config & logging ─────────
config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)               # type: ignore[arg-type]

logger = logging.getLogger("alembic.env")

# Inject runtime DATABASE_URL (falls back to settings)
config.set_main_option(
    "sqlalchemy.url",
    os.getenv("DATABASE_URL", settings.DATABASE_URL),
)

# Metadata for autogenerate
target_metadata = SQLModel.metadata


# ───────── offline (generate SQL only) ─────────
def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (no DB connection)."""
    url: str = config.get_main_option("sqlalchemy.url")   # type: ignore[assignment]
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


# ───────── online (live asyncpg) ───────────────
def run_migrations_online() -> None:
    """Run migrations with a real asyncpg connection."""
    cfg: dict[str, Any] = config.get_section(config.config_ini_section, {})
    connectable: AsyncEngine = async_engine_from_config(          # type: ignore[assignment]
        cfg,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
    )

    async def _run_migrations(connection: Connection) -> None:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            render_as_batch=True,      # keeps SQLite dev happy
        )
        with context.begin_transaction():
            context.run_migrations()

    async def _async_main() -> None:
        async with connectable.connect() as connection:
            await connection.run_sync(_run_migrations)
        await connectable.dispose()

    asyncio.run(_async_main())


# ───────── choose mode ─────────
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
