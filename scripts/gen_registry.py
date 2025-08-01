#!/usr/bin/env python3
"""Generate backend/app/registry.py from plug-in manifests."""

import importlib.util
import pathlib
import sys

root = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / "backend"))

manifests: dict[str, tuple[str, object]] = {}
for path in (root / "backend" / "plugins").glob("*/manifest.py"):
    pkg = path.parent.name
    spec = importlib.util.spec_from_file_location(pkg, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # type: ignore
    manifest = getattr(mod, "manifest", None)
    if manifest is None:
        continue
    manifests[manifest.id] = (pkg, manifest)

lines = [
    "from typing import Dict",
    "",
    "from app.schemas.plugins import PluginManifest",
]
for name, (pkg, _) in manifests.items():
    var = name.replace('-', '_')
    lines.append(f"from plugins.{pkg}.manifest import manifest as {var}_manifest")

lines.append("")
lines.append("REGISTRY: Dict[str, PluginManifest] = {")
for name in manifests:
    var = name.replace('-', '_')
    lines.append(f'    "{name}": {var}_manifest,')
lines.append("}")
lines.append("")
lines.append("registry = REGISTRY")
lines.append("__all__ = ['REGISTRY', 'registry']")

(root / "backend" / "app" / "registry.py").write_text("\n".join(lines) + "\n")
print("\u2705 generated backend/app/registry.py")
