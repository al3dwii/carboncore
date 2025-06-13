from app.schemas.plugins import PluginManifest, Route, Schedule
manifest = PluginManifest(
 id="budget-copilot",
 event_types=["budget_forecast", "budget_overshoot"],
 routes=[Route(handler="plugins.budget.budget.views:router", prefix="")],
 schedules=[
  Schedule(name="budget.forecast", task="plugins.budget.budget.forecast:hourly", every=3600),
  Schedule(name="budget.overshoot", task="plugins.budget.budget.alert:overshoot", every=3600)
 ]
)
