# backend/worker/loader.py
from __future__ import annotations

import os
from importlib import import_module

from celery import Celery
from celery.schedules import crontab

from backend.app.registry import registry

# ────────────────────────────── new bits ──────────────────────────────
BROKER_URL  = os.getenv("CELERY_BROKER_URL",  "redis://localhost:6379/0")
RESULT_BACK = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

app = Celery("carboncore", broker=BROKER_URL, backend=RESULT_BACK)
# visibility timeout + DLQ
app.conf.update(
  task_acks_late=True,
  broker_transport_options={"visibility_timeout": 3600},
  task_default_queue="default",
  task_default_exchange_type="direct",
  task_routes={"*_dlq": {"queue": "dead-letter"}},
)


@app.task(name="dlq.rescue", queue="dead-letter")
def rescue(body, **_):
    """Handle messages sent to the dead-letter queue."""
    # log / send to OpsGenie, then maybe re-queue once
    pass
# ──────────────────────────────────────────────────────────────────────

# pick up any other Celery-specific options from settings (optional)
app.config_from_object("app.core.settings", namespace="CELERY")

# register plugin tasks + periodic schedules (your existing logic)
for pm in registry.values():
    for s in pm.schedules:
        mod, obj = s.task.split(":")
        task = getattr(import_module(mod), obj)
        if not hasattr(task, "apply_async"):      # wrap plain function
            task = app.task(name=s.name)(task)

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
