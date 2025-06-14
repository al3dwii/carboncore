from app.schemas.plugins import PluginManifest, Route
manifest = PluginManifest(
    id="eco-label",
    event_types=["ecolabel_view"],
    routes=[
        Route(handler="plugins.ecolabel.ecolabel.views:router", prefix=""),
        Route(handler="plugins.ecolabel.ecolabel.hooks:router", prefix=""),
    ],
)
