from app.schemas.plugins import PluginManifest, Route

manifest = PluginManifest(
    id="iac-advisor",
    event_types=["iac_advice"],
    routes=[
        Route(
            handler="plugins.iac_advisor.iac_advisor.views:router",
            prefix="/iac-advisor"
        )
    ],
)
