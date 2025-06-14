from backend.worker.loader import app
from plugins.pulse.pulse.models import Supplier
from app.database import SessionLocal
from app.models import Event
import random, datetime
@app.task(name="pulse.scan")
def nightly():
    with SessionLocal() as db:
        for sup in db.query(Supplier):
            g=random.uniform(sup.sla_gco2*0.8, sup.sla_gco2*1.2)
            Event.create(event_type_id="supplier_scan",
                         meta={"supplier":sup.name,"g_co2":g,"ts":datetime.datetime.utcnow().isoformat()})
