from typing import Dict

from app.schemas.plugins import PluginManifest
from plugins.carbon-comply.manifest import manifest as carbon_comply_manifest
from plugins.eco-shift.manifest import manifest as eco_shift_manifest
from plugins.core.manifest import manifest as core_manifest

REGISTRY: Dict[str, PluginManifest] = {
    "carbon-comply": carbon_comply_manifest,
    "eco-shift": eco_shift_manifest,
    "core": core_manifest,
}

registry = REGISTRY
__all__ = ['REGISTRY', 'registry']
