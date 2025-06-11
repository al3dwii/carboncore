from app.plugin_manifest import PluginManifest
from app.plugin_manifest import PluginManifest, Route

manifest = PluginManifest(
    id="core",
    tasks=["backend.app.tasks.worker.weekly_sync"],
    routes=[
        Route(handler="app.routers.skus:router"),
        Route(handler="app.routers.carbon:router"),
        Route(handler="app.routers.events:router"),
        Route(handler="app.routers.tokens:router"),
    ],
)
