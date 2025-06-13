from datetime import datetime
from backend.worker.loader import app
from plugins.budget.budget.models import CarbonBudget
from app.models import Event, SessionLocal
@app.task(name="budget.forecast")
def hourly():
    with SessionLocal() as db:
        for b in db.query(CarbonBudget):
            # naive forecast: 1 t CO2 per week left
            eta = (datetime.fromisoformat(b.end) - datetime.utcnow()).days/7
            Event.create(event_type_id="budget_forecast", meta={"eta_weeks":eta})
