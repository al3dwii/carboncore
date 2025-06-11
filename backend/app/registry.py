from .plugin_manifest import PluginManifest

REGISTRY = {
    "core": PluginManifest(**{'id': 'core', 'version': '0.1', 'tasks': ['app.tasks.worker.weekly_sync']}),
}
