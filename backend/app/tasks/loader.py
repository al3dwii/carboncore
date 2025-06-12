"""Utility for registering plugin tasks with Celery."""

from importlib import import_module
from celery import Celery
from app.registry import REGISTRY


def load_plugin_tasks(celery_app: Celery) -> None:
    """Register tasks from plugin manifests.

    The new manifest schema exposes ``schedules`` rather than a bare ``tasks``
    list.  Each schedule defines the dotted path to the task callable.  For now
    we simply register each referenced task with Celery so it becomes available
    for ``celery inspect registered``.
    """

    for manifest in REGISTRY.values():
        for sch in getattr(manifest, "schedules", []):
            module, func = sch.task.split(":")
            target = getattr(import_module(module), func)
            celery_app.task(target, name=sch.name)
