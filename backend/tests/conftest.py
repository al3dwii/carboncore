"""
Pytest fixtures for CarbonCore backend tests.

The first block makes sure the repo’s **backend** directory (which
contains the `app` package) is on `sys.path` no matter where the tests
are executed from (CI, IDE, or manually).
"""

# ruff: noqa

from __future__ import annotations

# ─── make `app` importable ─────────────────────────────────────────
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]   # …/backend
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
# ───────────────────────────────────────────────────────────────────

import os

os.environ.setdefault(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./test.db"   # isolate tests from the live Postgres
)

# Use fakeredis for unit tests and silence OTEL exporter noise
os.environ.setdefault("REDIS_URL", "fakeredis://")
os.environ.setdefault("OTEL_TRACES_EXPORTER", "none")
os.environ.setdefault("ENABLE_TRACING", "false")

# Force all tests to run under asyncio
os.environ.setdefault("ANYIO_BACKEND", "asyncio")

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///:memory:")  # noqa: E402

from app.main import app  # noqa: E402
from app.core.deps import init_db
from app.services import carbon_feed
from app.routers import carbon as carbon_router
from unittest.mock import AsyncMock

fake_fetch = AsyncMock(return_value=123.4)
carbon_feed.fetch_intensity = fake_fetch
carbon_router.fetch_intensity = fake_fetch
carbon_router.carbon_intensity = carbon_router.limiter.limit("30/minute")(carbon_router.carbon_intensity)


@pytest_asyncio.fixture
async def client():
    """Reusable async HTTP client bound to the FastAPI app."""
    carbon_router.limiter.reset()
    await init_db()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def anyio_backend():
    """Force pytest-anyio to use asyncio only."""
    return "asyncio"
