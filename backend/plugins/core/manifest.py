from app.schemas.plugins import PluginManifest, Route

manifest = PluginManifest(
    id="core",
    routes=[
        Route(handler="app.routers.skus:router", prefix=""),
        Route(handler="app.routers.carbon:router", prefix=""),
        Route(handler="app.routers.events:router", prefix=""),
        Route(handler="app.routers.tokens:router", prefix=""),
    ],
)
