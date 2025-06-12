from app.schemas.plugins import PluginManifest, Route

REGISTRY: dict[str, PluginManifest] = {
    "core": PluginManifest(**{'id': 'core', 'event_types': [], 'routes': [{'handler': 'app.routers.skus:router', 'path': None, 'method': 'GET', 'prefix': ''}, {'handler': 'app.routers.carbon:router', 'path': None, 'method': 'GET', 'prefix': ''}, {'handler': 'app.routers.events:router', 'path': None, 'method': 'GET', 'prefix': ''}, {'handler': 'app.routers.tokens:router', 'path': None, 'method': 'GET', 'prefix': ''}], 'schedules': []}),
}

registry = REGISTRY  # FastAPI alias
__all__ = ['REGISTRY', 'registry']
