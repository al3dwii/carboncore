from app.schemas.plugins import PluginManifest, Route
manifest = PluginManifest(
 id="carbon-comply",
 event_types=["comply_export"],
 routes=[Route(handler="plugins.carboncomply.carboncomply.views:export_xlsx", path="/comply/xlsx", method="GET")],
 schedules=[{"name":"offset.alert","task":"plugins.carboncomply.carboncomply.alert:notify","every":43200}]
)
