"""
Pytest fixtures for CarbonCore backend tests.

The first block makes sure the repo’s **backend** directory (which
contains the `app` package) is on `sys.path` no matter where the tests
are executed from (CI, IDE, or manually).
"""

from __future__ import annotations

# ─── make `app` importable ─────────────────────────────────────────
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[1]   # …/backend
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
# ───────────────────────────────────────────────────────────────────

import pytest_asyncio
from httpx import AsyncClient
from app.main import app


@pytest_asyncio.fixture
async def client():
    """Reusable async HTTP client bound to the FastAPI app."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
