"""
Collect all plugin manifests and write backend/app/registry.py
"""

import importlib.util
import pathlib
import sys
import textwrap


root = pathlib.Path(__file__).resolve().parent.parent  # …/backend
sys.path.insert(0, str(root))  # <─ NEW LINE

from app.plugin_manifest import PluginManifest  # now import works


# from backend.app.plugin_manifest import PluginManifest  # noqa: F401 – import validates

# root = pathlib.Path(__file__).resolve().parent.parent  # …/backend
manifests = []

# ── load every plugins/*/manifest.py ───────────────────────────────────────────
for path in (root / "plugins").glob("*/manifest.py"):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)  # type: ignore[attr-defined]
    manifests.append(mod.manifest)

# ── validate IDs are unique ────────────────────────────────────────────────────
ids = [m.id for m in manifests]
dupes = {i for i in ids if ids.count(i) > 1}
if dupes:
    sys.exit(f"duplicate plugin ids: {dupes}")

# ── write backend/app/registry.py ──────────────────────────────────────────────
target = root / "app" / "registry.py"
registry_dict = {m.id: m for m in manifests}

target.write_text(
    "from app.plugin_manifest import PluginManifest, Route\n\n"
    "REGISTRY = " + textwrap.indent(repr(registry_dict), " ") + "\n"
)


print(f"✅ wrote {target.relative_to(root)} with {len(manifests)} plugin(s)")
