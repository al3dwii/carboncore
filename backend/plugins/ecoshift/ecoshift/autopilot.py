from datetime import datetime, timedelta
from celery import Celery
try:
    from backend.worker.loader import app
except Exception:  # fall back when backend package not on path
    app = Celery("carboncore")
from plugins.ecoshift.ecoshift.views import suggest

@app.task(name="shift.autopilot")
def run():
    spec = dict(
        vcpu_hours=2,
        earliest=datetime.utcnow().isoformat(),
        latest=(datetime.utcnow() + timedelta(hours=4)).isoformat(),
        preferred_region="DE",
    )
    slot = suggest(spec)  # type: ignore
    return slot
