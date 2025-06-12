from backend.worker.loader import app
import os, requests

@app.task(name="offset.alert")
def notify():
    requests.post(os.getenv("SLACK_WEBHOOK"), json={"text": "Offset threshold reached"})
