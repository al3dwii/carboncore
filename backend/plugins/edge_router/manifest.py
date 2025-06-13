from app.schemas.plugins import PluginManifest, Route
manifest = PluginManifest(
    id="edge-router",
    event_types=["edge_route"],
    routes=[Route(handler="plugins.edge_router.edge_router.views:router", prefix="")]
)
