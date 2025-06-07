"""
CarbonCore FastAPI entry-point  (v0.1.0-beta)
─────────────────────────────────────────────
• Secure Headers, CORS and global SlowAPI rate-limiting
• JSON logs via `core.logging.init_logging`
• OTEL traces (FastAPI + httpx + SQLAlchemy)
• Prometheus /metrics (compressed) via Instrumentator
• Pagination wired globally (`fastapi_pagination`)
• Health / ready probes & blue-green root-path support
"""

from __future__ import annotations          # ← PEP-236: must follow the docstring

# ───────────── stdlib / typing ─────────────
from contextlib import asynccontextmanager
from datetime import datetime
from typing import Final

# ─────────────── 3rd-party ────────────────
import structlog
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.middleware import Middleware

from fastapi import FastAPI, Request, Response   # ← add Response here

from datetime import UTC, datetime

# ─────────────── internal ────────────────
from app.middleware.secure_headers import SecureHeadersMiddleware
from .core.deps import engine, init_db
from .core.logging import init_logging
from .core.otel import init_otel
from .core.ratelimit import attach as attach_rate_limit, limiter
from .core.settings import settings
from .routers import carbon, events, skus, tokens

# ────────────── logging bootstrap ──────────
init_logging()                               # JSON logs → STDOUT
log = structlog.get_logger()

# ───────────── lifespan handler ────────────
@asynccontextmanager
async def lifespan(_: FastAPI):
    log.info("lifespan.start", env=getattr(settings, "ENV", "dev"))
    await init_db()
    yield
    log.info("lifespan.stop")

# ───────────── middleware list ─────────────
MIDDLEWARE: Final[list[Middleware]] = []
if getattr(settings, "SECURE_HEADERS", True):
    MIDDLEWARE.append(Middleware(SecureHeadersMiddleware))

# ───────────── FastAPI factory ─────────────
app = FastAPI(
    version=getattr(settings, "BUILD_SHA", None) or "0.1.0-beta.1",
    docs_url="/",
    redoc_url=None,
    root_path=f"/{settings.BLUE_GREEN_COLOR}" if getattr(settings, "BLUE_GREEN_COLOR", "") else "",
    lifespan=lifespan,
    middleware=MIDDLEWARE,
)

# NOTE: **do NOT** add SlowAPIMiddleware manually here.
# `core.ratelimit.attach()` installs it with the right arguments.

# ───────────── CORS (wide-open) ────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────── Routers ─────────────────────
for router in (skus.router, tokens.router, events.router, carbon.router):
    app.include_router(router)

# ───────────── Helpers / pagination / RL ───
attach_rate_limit(app)                       # installs SlowAPIMiddleware
add_pagination(app)

@limiter.limit("1/second")            # ← outer-most so SlowAPI sees it first
@app.get("/healthz", include_in_schema=False)
async def healthz(request: Request, response: Response) -> dict[str, str]:
    """Liveness probe (rate-limited)."""
    return {
        "status": "ok",
        "ts": datetime.now(UTC).isoformat(timespec="seconds"),
    }


@app.get("/readyz", include_in_schema=False)
async def readyz() -> dict[str, str]:
    """Readiness probe (no rate-limit)."""
    return {
        "status": "ready",
        "instance": getattr(settings, "INSTANCE_ID", "local"),
        "color": getattr(settings, "BLUE_GREEN_COLOR", "default"),
    }

# ───────────── Prometheus ───────────────────
if getattr(settings, "ENABLE_METRICS", True):
    Instrumentator().instrument(app).expose(
        app, endpoint="/metrics", include_in_schema=False, should_gzip=True
    )
    log.info("prometheus.enabled")

# ───────────── OpenTelemetry ────────────────
if getattr(settings, "ENABLE_TRACING", True):
    try:
        init_otel(app, engine)
        log.info("otel.enabled")
    except ImportError:             # pragma: no cover
        log.warning("otel.not_installed")
    except NotImplementedError:     # pragma: no cover
        log.warning("otel.unsupported_engine")

log.info("app.initialised")

# ───────────── Local dev runner ─────────────
if __name__ == "__main__":                    # pragma: no cover
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_includes=["*.py"],
    )
