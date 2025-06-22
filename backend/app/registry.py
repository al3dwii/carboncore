from app.schemas.plugins import PluginManifest, Route

REGISTRY: dict[str, PluginManifest] = {
    "budget-copilot": PluginManifest(**{'id': 'budget-copilot', 'event_types': ['budget_forecast', 'budget_overshoot'], 'routes': [{'handler': 'plugins.budget.budget.views:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'mount_point': None, 'schedules': [{'name': 'budget.forecast', 'task': 'plugins.budget.budget.forecast:hourly', 'every': 3600, 'cron': None}, {'name': 'budget.overshoot', 'task': 'plugins.budget.budget.alert:overshoot', 'every': 3600, 'cron': None}]}),
    "carbon-comply": PluginManifest(**{'id': 'carbon-comply', 'event_types': ['comply_export'], 'routes': [{'handler': 'plugins.carboncomply.carboncomply.views:export_xlsx', 'path': '/comply/xlsx', 'method': 'GET', 'prefix': None}], 'mount_point': None, 'schedules': [{'name': 'offset.alert', 'task': 'plugins.carboncomply.carboncomply.alert:notify', 'every': 43200, 'cron': None}]}),
    "core": PluginManifest(**{'id': 'core', 'event_types': [], 'routes': [], 'mount_point': 'plugins.core.routes:register_routes', 'schedules': [{'name': 'echo', 'task': 'plugins.core.tasks:echo', 'every': 3600, 'cron': None}]}),
    "eco-label": PluginManifest(**{'id': 'eco-label', 'event_types': ['ecolabel_view'], 'routes': [{'handler': 'plugins.ecolabel.ecolabel.views:router', 'path': None, 'method': 'GET', 'prefix': ''}, {'handler': 'plugins.ecolabel.ecolabel.hooks:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'mount_point': None, 'schedules': []}),
    "eco-shift": PluginManifest(**{'id': 'eco-shift', 'event_types': ['ecs_shift'], 'routes': [{'handler': 'plugins.ecoshift.ecoshift.views:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'mount_point': None, 'schedules': [{'name': 'shift.autopilot', 'task': 'plugins.ecoshift.ecoshift.autopilot:run', 'every': 300, 'cron': None}]}),
    "edge-router": PluginManifest(**{'id': 'edge-router', 'event_types': ['edge_route'], 'routes': [{'handler': 'plugins.edge_router.edge_router.views:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'mount_point': None, 'schedules': []}),
    "green-dev": PluginManifest(**{'id': 'green-dev', 'event_types': ['dev_advice'], 'routes': [{'handler': 'plugins.greendev.greendev.views:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'mount_point': None, 'schedules': []}),
    "iac-advisor": PluginManifest(**{'id': 'iac-advisor', 'event_types': ['iac_advice'], 'routes': [{'handler': 'plugins.iac_advisor.iac_advisor.views:router', 'path': None, 'method': 'GET', 'prefix': '/iac-advisor'}], 'mount_point': None, 'schedules': []}),
    "offset-sync": PluginManifest(**{'id': 'offset-sync', 'event_types': ['offset_buy', 'saving'], 'routes': [], 'mount_point': None, 'schedules': []}),
    "supply-pulse": PluginManifest(**{'id': 'supply-pulse', 'event_types': ['supplier_scan'], 'routes': [{'handler': 'plugins.pulse.pulse.views:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'mount_point': None, 'schedules': [{'name': 'pulse.scan', 'task': 'plugins.pulse.pulse.scanner:nightly', 'every': None, 'cron': '0 2 * * *'}]}),
}

registry = REGISTRY  # FastAPI alias
__all__ = ['REGISTRY', 'registry']
