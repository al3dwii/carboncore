"""
CarbonCore FastAPI entry-point (v0.1.0-beta).

Highlights
──────────
• Secure Headers, CORS and global SlowAPI rate-limiting
• JSON logs via `core.logging.init_logging`
• OTEL traces (FastAPI + httpx + SQLAlchemy) via `core.otel.init_otel`
• Prometheus /metrics (compressed) via Instrumentator
• Pagination wired globally (`fastapi_pagination`)
• Health/ready probes & blue/green root-path support
"""

from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime
from typing import Final

import structlog
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.middleware import Middleware

from app.middleware.secure_headers import SecureHeadersMiddleware

from .core.deps import engine, init_db
from .core.logging import init_logging
from .core.otel import init_otel
from .core.ratelimit import attach as attach_rate_limit, limiter
from .core.settings import settings
from .routers import carbon, events, skus, tokens

# ──────────────── logging bootstrap ────────────────────────────
init_logging()                      # JSON logs straight to STDOUT
log = structlog.get_logger()

# ──────────────── lifespan hook ────────────────────────────────
@asynccontextmanager
async def lifespan(_: FastAPI):
    log.info("lifespan.start", env=getattr(settings, "ENV", "dev"))
    await init_db()
    yield
    log.info("lifespan.stop")


# ──────────────── middleware list ──────────────────────────────
MIDDLEWARE: Final = []
if getattr(settings, "SECURE_HEADERS", True):
    # Apply Secure headers via custom Starlette middleware
    MIDDLEWARE.append(Middleware(SecureHeadersMiddleware))

# ──────────────── FastAPI factory ──────────────────────────────
app = FastAPI(
    title="CarbonCore API",
    version=getattr(settings, "BUILD_SHA", None) or "0.1.0-beta.1",
    docs_url="/",
    redoc_url=None,
    root_path=f"/{settings.BLUE_GREEN_COLOR}" if getattr(settings, "BLUE_GREEN_COLOR", "") else "",
    lifespan=lifespan,
    middleware=MIDDLEWARE,
)

# CORS (wide-open for now; tighten before GA)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
for router in (skus.router, tokens.router, events.router, carbon.router):
    app.include_router(router)

# Global helpers
attach_rate_limit(app)
add_pagination(app)

# Health / readiness probes
@app.get("/healthz", include_in_schema=False)
@limiter.limit("20/second")
async def healthz(request: Request) -> dict[str, str]:
    return {"status": "ok", "ts": datetime.utcnow().isoformat()}


@app.get("/readyz", include_in_schema=False)
async def readyz() -> dict[str, str]:
    return {
        "status": "ready",
        "instance": getattr(settings, "INSTANCE_ID", "local"),
        "color": getattr(settings, "BLUE_GREEN_COLOR", "default"),
    }

# ──────────────── Prometheus metrics ───────────────────────────
if getattr(settings, "ENABLE_METRICS", True):
    Instrumentator().instrument(app).expose(
        app,
        endpoint="/metrics",
        include_in_schema=False,
        should_gzip=True,
    )
    log.info("prometheus.enabled")

# ──────────────── OpenTelemetry traces ─────────────────────────
if getattr(settings, "ENABLE_TRACING", True):
    try:
        init_otel(app, engine)
        log.info("otel.enabled")
    except ImportError:             # pragma: no cover
        log.warning("otel.not_installed")
    except NotImplementedError:     # pragma: no cover
        log.warning("otel.unsupported_engine")

log.info("app.initialised")

# ─────────── local developer entry-point (uvicorn) ─────────────
if __name__ == "__main__":          # pragma: no cover
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_includes=["*.py"],
    )
