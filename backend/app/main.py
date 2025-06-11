"""
CarbonCore FastAPI entry-point  (v0.2.0-frozen)
──────────────────────────────────────────────
• Secure Headers, CORS, global SlowAPI rate-limiting
• JSON logs via core.logging.init_logging
• OTEL traces (auto-disabled if Tempo absent)
• Prometheus /metrics (gzip) via Instrumentator
• Global Pagination (fastapi_pagination)
• Health / ready probes & blue-green root-path support
"""

from __future__ import annotations

# ───────────── stdlib ─────────────
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from importlib import import_module
from typing import Final

# ───────────── 3rd-party ─────────────
import structlog
import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from prometheus_fastapi_instrumentator import Instrumentator
from starlette.middleware import Middleware

# ───────────── internal ─────────────
from app.core.logging import init_logging
from app.core.deps import engine, init_db
from app.core.settings import settings
from app.core.otel import init_otel
from app.core.ratelimit import (
    configure as rl_configure,
    attach as attach_rate_limit,
    limiter,
)
from app.middleware.secure_headers import SecureHeadersMiddleware
from app.registry import REGISTRY

# ───────────── rate-limit defaults ─────────────
# 1 request / minute globally; tests override with route-level decorator
rl_configure(default_limits=["1/minute"])

# ───────────── logging bootstrap ─────────────
init_logging()
log = structlog.get_logger()

# ───────────── lifespan handler ─────────────
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
    version=getattr(settings, "BUILD_SHA", None) or "0.2.0-frozen",
    docs_url="/",
    redoc_url=None,
    root_path=f"/{settings.BLUE_GREEN_COLOR}"
    if getattr(settings, "BLUE_GREEN_COLOR", "")
    else "",
    lifespan=lifespan,
    middleware=MIDDLEWARE,
)

# ───────────── CORS (wide-open) ─────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────── Plugin Routers (dynamic) ────
for pm in REGISTRY.values():
    for route in pm.routes:
        mod_path, obj_name = route.handler.split(":")
        target = getattr(import_module(mod_path), obj_name)

        if hasattr(target, "include_router"):          # APIRouter
            app.include_router(target, prefix=route.prefix or "")
            log.info("router.mounted", plugin=pm.id, router=obj_name)
        else:                                          # single-function route
            app.add_api_route(
                route.path, target, methods=[route.method], name=f"{pm.id}:{obj_name}"
            )
            log.info("route.mounted", plugin=pm.id, path=route.path)

# ───────────── Helpers / pagination / RL ───
attach_rate_limit(app)            # installs SlowAPIMiddleware + 429 handler
add_pagination(app)

# backend/app/main.py  ── replace the decorator line
@limiter.limit("1/minute", key_func=lambda *args, **kw: "health-burst")
@app.get("/healthz", include_in_schema=False)
async def healthz(request: Request, response: Response) -> dict[str, str]:
    """Liveness probe (rate-limited)."""
    return {"status": "ok", "ts": datetime.now(UTC).isoformat(timespec="seconds")}


@app.get("/readyz", include_in_schema=False)
async def readyz() -> dict[str, str]:
    """Readiness probe (no rate-limit)."""
    return {
        "status": "ready",
        "instance": getattr(settings, "INSTANCE_ID", "local"),
        "color": getattr(settings, "BLUE_GREEN_COLOR", "default"),
    }

# ───────────── Prometheus ────────────────
if getattr(settings, "ENABLE_METRICS", True):
    Instrumentator().instrument(app).expose(
        app, endpoint="/metrics", include_in_schema=False, should_gzip=True
    )
    log.info("prometheus.enabled")

# ───────────── OpenTelemetry ─────────────
if getattr(settings, "ENABLE_TRACING", False):     # default off for dev
    try:
        init_otel(app, engine)
        log.info("otel.enabled")
    except Exception as exc:                       # pragma: no cover
        log.warning("otel.disabled", err=str(exc))

log.info("app.initialised")

# ───────────── Local dev runner ─────────────
if __name__ == "__main__":                         # pragma: no cover
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_includes=["*.py"],
    )
