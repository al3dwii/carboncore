from app.schemas.plugins import PluginManifest, Route

manifest = PluginManifest(
    id="iac-advisor",
    event_types=["iac-scan"],
    routes=[
        Route(
            handler="plugins.iac_advisor.iac_advisor.views:router",
            prefix="/advisor",
        )
    ],
    schedules=[
        dict(
            name="advisor.autopilot",
            task="plugins.iac_advisor.iac_advisor.autopilot:rebuild_metrics",
            every=86_400,
        )
    ],
)
