#!/usr/bin/env python3
import importlib.util
import pathlib
import textwrap
import sys

root = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root / "backend"))
from app.schemas.plugins import PluginManifest
manifests = []
for path in (root / "backend" / "plugins").glob("*/manifest.py"):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # type: ignore
    manifests.append(mod.manifest)

ids = [m.id for m in manifests]
dup = [i for i in ids if ids.count(i) > 1]
if dup:
    raise SystemExit(f"duplicate plugin id {dup}")

reg_py = (
    "from app.schemas.plugins import PluginManifest, Route\nregistry = "
    + textwrap.indent(repr(manifests), " ")
)
(root / "backend" / "app" / "registry.py").write_text(reg_py)
print("\u2705 generated backend/app/registry.py")
