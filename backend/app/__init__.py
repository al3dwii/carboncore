# ── app/__init__.py ─────────────────────────────────────────
"""
CarbonCore package bootstrap.

This section exports the old `backend.*` namespace so that
un-migrated plug-ins keep working until they are refactored.
Delete once all imports use the new `app.*` tree.
"""
import sys
import importlib

# map: backend  -> app
sys.modules.setdefault("backend", importlib.import_module("app"))

# map: backend.worker -> app.tasks
sys.modules.setdefault("backend.worker",
                       importlib.import_module("app.tasks"))

# map: backend.worker.loader -> app.tasks.loader
sys.modules.setdefault("backend.worker.loader",
                       importlib.import_module("app.tasks.loader"))
# ────────────────────────────────────────────────────────────
