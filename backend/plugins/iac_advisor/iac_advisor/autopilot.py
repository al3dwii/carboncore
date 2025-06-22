from celery import Celery

try:
    from backend.worker.loader import app
except Exception:  # pragma: no cover
    app = Celery("carboncore")

@app.task(name="iac_advisor.autopilot")
def run():
    return "ok"
