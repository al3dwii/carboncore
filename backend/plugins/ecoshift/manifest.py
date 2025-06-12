from app.schemas.plugins import PluginManifest, Route
manifest = PluginManifest(
    id="eco-shift",
    event_types=["ecs_shift"],
    routes=[
        Route(handler="plugins.ecoshift.ecoshift.views:router", prefix="")
    ],
    schedules=[
        dict(name="shift.autopilot", task="plugins.ecoshift.ecoshift.autopilot:run", every=300)
    ]
)
