"""Celery worker entry-point for CarbonCore."""

from __future__ import annotations

import asyncio

from celery import Celery
from celery.schedules import crontab
from opentelemetry.instrumentation.celery import CeleryInstrumentor
from sqlmodel.ext.asyncio.session import AsyncSession

from ..core.deps import engine
from ..core.settings import get_settings
from ..services.catalogue_sync import sync_skus
from . import loader as _loader
from .loader import load_plugin_tasks

# ─────────────────────────── Celery bootstrap ────────────────────────────────
settings = get_settings()

celery_app = Celery(
    "worker",
    broker=settings.redis_url,
    backend=settings.redis_url,
)

# Let plug-ins import “backend.worker.loader.app”
_loader.set_celery_app(celery_app)

# OpenTelemetry (harmless unless OTEL env-vars are set)
CeleryInstrumentor().instrument()

# Conventional aliases
celery = celery_app   # used by the `celery` CLI
app = celery_app      # some plug-ins import this symbol directly

# ──────────────────────────── Tasks & beat ───────────────────────────────────
def weekly_sync() -> None:
    """Synchronise SKU catalogue once a week."""
    async def _run() -> None:
        async with AsyncSession(engine) as session:
            await sync_skus(session)
    asyncio.run(_run())


celery_app.conf.beat_schedule = {
    "weekly-sync-task": {
        "task": "app.tasks.worker.weekly_sync",
        "schedule": crontab(hour=0, minute=0, day_of_week="monday"),
    }
}
celery_app.conf.timezone = "UTC"

# Register tasks discovered in plug-in manifests
load_plugin_tasks(celery_app)
