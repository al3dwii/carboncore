from app.schemas.plugins import PluginManifest, Route
manifest = PluginManifest(
 id="green-dev",
 event_types=["dev_advice"],
 routes=[Route(handler="plugins.greendev.greendev.views:router", prefix="")]
)
