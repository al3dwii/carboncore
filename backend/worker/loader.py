from celery import Celery
from importlib import import_module
from backend.app.registry import registry
from celery.schedules import crontab

app = Celery("carboncore")
app.config_from_object("backend.app.settings", namespace="CELERY")

for pm in registry.values():
    for s in pm.schedules:
        mod, obj = s.task.split(":")
        task = getattr(import_module(mod), obj)
        app.register_task(task)
        if s.every:
            app.conf.beat_schedule[s.name] = {
                "task": task.name,
                "schedule": s.every,
            }
        elif s.cron:
            app.conf.beat_schedule[s.name] = {
                "task": task.name,
                "schedule": crontab.from_crontab(s.cron),
            }
