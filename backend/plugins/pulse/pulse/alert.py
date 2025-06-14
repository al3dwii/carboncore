import os
import requests
from sqlalchemy import text
from backend.worker.loader import app
from app.database import SessionLocal

SLACK = os.getenv("SLACK_WEBHOOK")

@app.task(name="pulse.alert")
def alert_suppliers():
    """Notify when a supplier scan exceeds its SLA."""
    if not SLACK:
        return
    with SessionLocal() as db:
        rows = db.execute(
            text(
                "SELECT id, meta FROM event WHERE event_type_id='supplier_scan' "
                "AND (meta->>'alert') IS NULL AND "
                "(meta->>'g_co2')::float > (meta->>'sla')::float"
            )
        )
        for evt_id, meta in rows:
            requests.post(
                SLACK,
                json={
                    "text": f"\u26a0 {meta['supplier']} {meta['g_co2']:.2f} gCO2 exceeds {meta['sla']:.2f}"
                },
            )
            db.execute(
                text(
                    "UPDATE event SET meta = jsonb_set(meta,'{alert}','\"1\"',true) "
                    "WHERE id = :id"
                ),
                dict(id=evt_id),
            )
        db.commit()
