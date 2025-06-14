from app.schemas.plugins import PluginManifest

manifest = PluginManifest(
    id="offset-sync",
    event_types=["offset_buy", "saving"],
)
