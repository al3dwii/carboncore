"""Core plugin manifest exposing main API routers."""

from app.schemas.plugins import PluginManifest, Schedule
from plugins.core import tasks

manifest = PluginManifest(
    id="core",
    mount_point="plugins.core.routes:register_routes",
)

manifest.schedules = [
    Schedule(name="echo", task="plugins.core.tasks:echo", every=3600)
]
