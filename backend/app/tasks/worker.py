from celery import Celery
from celery.schedules import crontab
from opentelemetry.instrumentation.celery import CeleryInstrumentor
from sqlmodel.ext.asyncio.session import AsyncSession
from ..core.settings import get_settings
from ..services.catalogue_sync import sync_skus
from ..core.deps import engine
from .loader import load_plugin_tasks

settings = get_settings()
celery_app = Celery("worker", broker=settings.redis_url, backend=settings.redis_url)
CeleryInstrumentor().instrument()

# Make discoverable under default name
celery = celery_app

def weekly_sync():
    import asyncio
    async def _run():
        async with AsyncSession(engine) as session:
            await sync_skus(session)
    asyncio.run(_run())


# Schedule weekly sync via Celery beat
celery_app.conf.beat_schedule = {
    "weekly-sync-task": {
        "task": "app.tasks.worker.weekly_sync",
        "schedule": crontab(hour=0, minute=0, day_of_week="monday"),
    }
}
celery_app.conf.timezone = "UTC"
load_plugin_tasks(celery_app)
