"""Centralised rate-limit wiring for CarbonCore.

New in v0.2
───────────
• `configure()` helper lets callers change ``key_func`` or
  ``default_limits`` *once* before the Limiter is attached.
• Fallback defaults: key = client IP, global = 1 request / minute.
"""

from __future__ import annotations

# ───────────── 3rd-party ─────────────
from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

# ──────────── singleton Limiter ────────────
# NOTE: do *not* instantiate more than one Limiter per process.
limiter: Limiter | None = None


def _build_limiter(
    key_func=get_remote_address,  # client IP by default
    default_limits: list[str] | None = None,
) -> Limiter:
    if default_limits is None:
        default_limits = ["1/minute"]
    return Limiter(key_func=key_func, default_limits=default_limits)


# initialise with defaults immediately
limiter = _build_limiter()


# ───────────── public helpers ─────────────
def configure(*, key_func=None, default_limits: list[str] | None = None) -> None:
    """
    Call **once** at startup *before* :func:`attach`.

    Example
    -------
    >>> from app.core import ratelimit
    >>> ratelimit.configure(default_limits=["20/minute"])
    """
    global limiter
    limiter = _build_limiter(
        key_func=key_func or get_remote_address, default_limits=default_limits
    )


def attach(app: FastAPI) -> None:
    """
    Wire SlowAPI into *app*.

    1. expose the shared ``limiter`` on ``app.state``
    2. add ``SlowAPIMiddleware`` (no kwargs – latest SlowAPI auto-detects)
    3. register the JSON 429 handler
    """
    if limiter is None:  # pragma: no cover
        raise RuntimeError("ratelimit.configure() must run before attach()")

    app.state.limiter = limiter
    app.add_middleware(SlowAPIMiddleware)
    app.add_exception_handler(
        RateLimitExceeded, _rate_limit_exceeded_handler
    )
