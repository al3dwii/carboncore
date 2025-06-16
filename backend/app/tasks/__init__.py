from celery import Celery
from app.core.settings import settings

celery = Celery(
    "carboncore",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=["app.tasks.jobs"],
)

__all__ = ("celery",)
