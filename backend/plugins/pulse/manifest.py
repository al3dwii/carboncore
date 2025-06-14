from app.schemas.plugins import PluginManifest, Route, Schedule
manifest = PluginManifest(
 id="supply-pulse",
 event_types=["supplier_scan"],
 routes=[Route(handler="plugins.pulse.pulse.views:router",prefix="")],
 schedules=[Schedule(name="pulse.scan",task="plugins.pulse.pulse.scanner:nightly",cron="0 2 * * *")]
)
