#!/usr/bin/env python3
"""Generate plugin registry for the backend."""

import importlib
import pkgutil
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
PLUGINS_DIR = ROOT / "backend" / "plugins"
REGISTRY_FILE = ROOT / "backend" / "app" / "registry.py"

sys.path.insert(0, str(ROOT / "backend"))

lines = ["from .plugin_manifest import PluginManifest", "", "REGISTRY = {"]
for finder, name, ispkg in pkgutil.iter_modules([str(PLUGINS_DIR)]):
    module = importlib.import_module(f"plugins.{name}.manifest")
    manifest = getattr(module, "manifest")
    lines.append(f'    "{manifest.id}": PluginManifest(**{manifest.dict()}),')
lines.append("}\n")
REGISTRY_FILE.write_text("\n".join(lines))
print(f"Wrote {REGISTRY_FILE}")
