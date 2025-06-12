"""Core plugin manifest exposing main API routers."""

from app.schemas.plugins import PluginManifest, Schedule
from app.routers import skus, carbon, events, tokens
from plugins.core import tasks

manifest = PluginManifest(id="core")

# Register routers directly so the application mounts them without
# needing placeholder Route objects.
manifest.routes = [
    skus.router,
    carbon.router,
    events.router,
    tokens.router,
]

# Example scheduled task to ensure Celery detects at least one job
manifest.schedules = [
    Schedule(name="echo", task="plugins.core.tasks:echo", every=3600)
]
