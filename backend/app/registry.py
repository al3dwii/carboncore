from typing import Dict

from app.schemas.plugins import PluginManifest
from plugins.ecoshift.manifest import manifest as eco_shift_manifest
from plugins.carboncomply.manifest import manifest as carbon_comply_manifest
from plugins.core.manifest import manifest as core_manifest

REGISTRY: Dict[str, PluginManifest] = {
    "eco-shift": eco_shift_manifest,
    "carbon-comply": carbon_comply_manifest,
    "core": core_manifest,
}

registry = REGISTRY
__all__ = ['REGISTRY', 'registry']
