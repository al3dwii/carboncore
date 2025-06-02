from celery import Celery
from sqlmodel.ext.asyncio.session import AsyncSession
from ..core.settings import get_settings
from ..services.catalogue_sync import sync_skus
from ..core.deps import engine

settings = get_settings()
celery_app = Celery("worker", broker=settings.redis_url)

@celery_app.task
def weekly_sync():
    import asyncio
    async def _run():
        async with AsyncSession(engine) as session:
            await sync_skus(session)
    asyncio.run(_run())
