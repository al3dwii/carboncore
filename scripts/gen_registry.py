#!/usr/bin/env python3
"""Generate backend/app/registry.py from plug-in manifests."""

import importlib.util
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / "backend"))

manifests: dict[str, object] = {}
for path in (root / "backend" / "plugins").glob("*/manifest.py"):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # type: ignore
    manifest = getattr(mod, "manifest", None)
    if manifest is None:
        continue
    manifests[manifest.id] = manifest

lines = [
    "from typing import Dict",
    "",
    "from app.schemas.plugins import PluginManifest",
]
for name in manifests:
    lines.append(f"from plugins.{name}.manifest import manifest as {name}_manifest")

lines.append("")
lines.append("REGISTRY: Dict[str, PluginManifest] = {")
for name in manifests:
    lines.append(f'    "{name}": {name}_manifest,')
lines.append("}")
lines.append("")
lines.append("registry = REGISTRY")
lines.append("__all__ = ['REGISTRY', 'registry']")

(root / "backend" / "app" / "registry.py").write_text("\n".join(lines) + "\n")
print("\u2705 generated backend/app/registry.py")
