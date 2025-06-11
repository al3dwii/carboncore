from app.plugin_manifest import PluginManifest, Route

REGISTRY = {
    "core": PluginManifest(
        id="core",
        version="0.1.0",
        tasks=["backend.app.tasks.worker.weekly_sync"],
        routes=[
            Route(
                handler="app.routers.skus:router", path=None, method="GET", prefix=None
            ),
            Route(
                handler="app.routers.carbon:router",
                path=None,
                method="GET",
                prefix=None,
            ),
            Route(
                handler="app.routers.events:router",
                path=None,
                method="GET",
                prefix=None,
            ),
            Route(
                handler="app.routers.tokens:router",
                path=None,
                method="GET",
                prefix=None,
            ),
        ],
    )
}
