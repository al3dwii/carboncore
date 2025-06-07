"""Centralised rate-limit wiring for CarbonCore."""

from __future__ import annotations

# ───────────── 3rd-party ─────────────
from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

# ──────────── singleton Limiter ────────────
limiter: Limiter = Limiter(
    key_func=get_remote_address,   # client IP
    default_limits=["5/second"],   # global limit
)

# ───────────── public helper ─────────────
def attach(app: FastAPI) -> None:
    """
    Wire SlowAPI into *app*.

    1. expose the shared ``limiter`` on ``app.state``  
    2. add ``SlowAPIMiddleware`` (no kwargs – latest SlowAPI auto-detects)  
    3. register the JSON 429 handler
    """
    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)  # ← no kwargs!
    app.add_exception_handler(
        RateLimitExceeded,
        _rate_limit_exceeded_handler,
    )
