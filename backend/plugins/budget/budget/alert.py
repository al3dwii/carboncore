import os, requests
from app.tasks.worker import celery_app as app
from app.models import EventType
from app.core.deps import SessionLocal

SLACK = os.getenv("SLACK_WEBHOOK")

@app.task(name="budget.overshoot")
def overshoot():
    with SessionLocal() as db:
        rows = db.execute(
            "SELECT * FROM carbon_budget WHERE (cap_tco2 - used_tco2) < 1"
        )
        for row in rows:
            requests.post(SLACK, json={"text": f"\u26a0 Budget for project {row.id} nearly exhausted"})
            EventType.create(event_type_id="budget_overshoot", meta={"budget_id": row.id})
