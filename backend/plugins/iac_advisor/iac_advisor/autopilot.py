"""
Nightly job: turn raw SavingEvents into aggregate leaderboard rows.
Skip for Sprint-1 if you don’t care yet.
"""
from backend.worker.loader import app
from app.database import SessionLocal
from sqlmodel import select
from app.models import SavingEvent
from datetime import datetime, timedelta

@app.task(name="advisor.rebuild")
def rebuild_metrics():
    cutoff = datetime.utcnow() - timedelta(days=30)
    with SessionLocal() as db:
        total = db.exec(
            select(SavingEvent).where(
                SavingEvent.event_type_id == "iac-scan",
                SavingEvent.created_at >= cutoff,
            )
        ).count()
        # … write aggregates into another table or into Redis, etc.
