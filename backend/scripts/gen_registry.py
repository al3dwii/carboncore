#!/usr/bin/env python3
"""
Collect every plug-in manifest under  backend/plugins/**/manifest.py
and regenerate backend/app/registry.py

The output file exposes:

    REGISTRY : dict[str, PluginManifest]
    registry : alias to REGISTRY  (used by FastAPI)

Run this script from the repo root or from backend/.
"""

from __future__ import annotations

import importlib.util
import pathlib
import sys
import textwrap
from typing import Final

# ───────────────────────── resolve paths ──────────────────────────
ROOT: Final[pathlib.Path] = (
    pathlib.Path(__file__).resolve().parent.parent  # …/backend
)
PLUGINS_DIR: Final[pathlib.Path] = ROOT / "plugins"
TARGET: Final[pathlib.Path] = ROOT / "app" / "registry.py"

# Ensure backend/ is import-able (needed for pydantic models, etc.)
sys.path.insert(0, str(ROOT))

from app.schemas.plugins import PluginManifest, Route  # noqa: E402

# ───────────────────────── discover manifests ─────────────────────
manifests: list[PluginManifest] = []

for manifest_path in PLUGINS_DIR.glob("*/manifest.py"):
    spec = importlib.util.spec_from_file_location(manifest_path.stem, manifest_path)
    mod = importlib.util.module_from_spec(spec)  # type: ignore[arg-type]
    assert spec.loader  # mypy / pyright happy
    spec.loader.exec_module(mod)                 # type: ignore[attr-defined]
    manifests.append(mod.manifest)               # each file MUST export `manifest`

# ───────────────────────── basic validation ───────────────────────
ids = [m.id for m in manifests]
dupes = {pid for pid in ids if ids.count(pid) > 1}
if dupes:
    sys.exit(f"❌ duplicate plugin ids: {', '.join(sorted(dupes))}")

# Build deterministic dict (sorted keys ⇒ cleaner diffs)
REGISTRY_DICT: dict[str, PluginManifest] = {m.id: m for m in sorted(manifests, key=lambda m: m.id)}

# ───────────────────────── write registry.py ──────────────────────
lines: list[str] = [
    "from app.schemas.plugins import PluginManifest, Route",
    "",
    "REGISTRY: dict[str, PluginManifest] = {",
]

for pid, manifest in REGISTRY_DICT.items():
    payload = textwrap.indent(repr(manifest.model_dump()), " " * 8)  # pretty repr
    lines.append(f'    "{pid}": PluginManifest(**{payload.strip()}),')

lines.append("}")
lines.append("")               # newline
lines.append("registry = REGISTRY  # FastAPI alias")
lines.append("__all__ = ['REGISTRY', 'registry']")
lines.append("")               # trailing newline

TARGET.write_text("\n".join(lines))
print(f"✅ wrote {TARGET.relative_to(ROOT)} with {len(manifests)} plugin(s)")
