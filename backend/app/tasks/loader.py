"""
Utility for registering plugin tasks with Celery.

It also exposes a *compat-shim* so that legacy plug-ins can still do

    from backend.worker.loader import app

and receive a valid Celery object.
"""
from __future__ import annotations

import importlib
import sys
import types
from importlib import import_module
from typing import TYPE_CHECKING

from celery import Celery, current_app
from app.registry import REGISTRY

# ───────────────────────── Back-compat module aliases ────────────────────────
# ➊ Map fictitious package ``backend`` → real ``app`` package
sys.modules.setdefault("backend", importlib.import_module("app"))

# ➋ Provide stub package ``backend.worker``
sys.modules.setdefault("backend.worker", types.ModuleType("backend.worker"))

# ➌ Register THIS module under the old dotted path
sys.modules["backend.worker.loader"] = sys.modules[__name__]
# ──────────────────────────────────────────────────────────────────────────────

# A Celery object that plug-ins can import immediately.
# We start with Celery's *current_app* placeholder; the real worker will
# replace it at runtime (see worker.py).
app: Celery = current_app  # gets overwritten once the worker boots.


def set_celery_app(celery_app: Celery) -> None:
    """Called by the worker after it creates its Celery() instance."""
    global app
    app = celery_app


def load_plugin_tasks(celery_app: Celery) -> None:
    """Register every task referenced in every plugin manifest."""
    for manifest in REGISTRY.values():
        for sch in getattr(manifest, "schedules", []):
            module_name, func_name = sch.task.split(":")
            target = getattr(import_module(module_name), func_name)
            celery_app.task(target, name=sch.name)
