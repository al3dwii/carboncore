import os
from celery.schedules import crontab

broker_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
result_backend = broker_url
timezone = "UTC"
accept_content = ["json"]
task_serializer = result_serializer = "json"

beat_schedule = {
    "weekly-sku-sync": {
        "task": "app.tasks.worker.weekly_sync",
        "schedule": crontab(day_of_week="mon", hour=3, minute=0),
    },
}
