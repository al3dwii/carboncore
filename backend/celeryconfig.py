from celery.schedules import crontab

beat_schedule = {
    "weekly-sync": {
        "task": "backend.app.tasks.worker.weekly_sync",
        "schedule": crontab(day_of_week="sun", hour=2, minute=0),
    }
}
