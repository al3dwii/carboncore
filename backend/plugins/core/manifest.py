from app.plugin_manifest import PluginManifest

manifest = PluginManifest(
    id="core",
    version="0.1",
    tasks=["app.tasks.worker.weekly_sync"],
)
