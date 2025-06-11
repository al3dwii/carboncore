from celery import Celery
from celery.schedules import crontab
from sqlmodel.ext.asyncio.session import AsyncSession
from ..core.settings import get_settings
from ..services.catalogue_sync import sync_skus
from ..core.deps import engine

settings = get_settings()
celery_app = Celery("worker", broker=settings.redis_url, backend=settings.redis_url)

# Make discoverable under default name
celery = celery_app

@celery_app.task
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
