from importlib import import_module
from app.registry import REGISTRY


def load_plugin_tasks(celery_app) -> None:
    """Register tasks from plugin manifests."""
    for manifest in REGISTRY.values():
        for path in manifest.tasks:
            module, func = path.rsplit(".", 1)
            fn = getattr(import_module(module), func)
            celery_app.task(fn)
