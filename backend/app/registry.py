from typing import Dict

from app.schemas.plugins import PluginManifest
from plugins.core.manifest import manifest as core_manifest
from plugins.ecoshift.manifest import manifest as eco_shift_manifest
from plugins.edge_router.manifest import manifest as edge_router_manifest
from plugins.carboncomply.manifest import manifest as carbon_comply_manifest
from plugins.budget.manifest import manifest as budget_copilot_manifest

REGISTRY: Dict[str, PluginManifest] = {
    "core": core_manifest,
    "eco-shift": eco_shift_manifest,
    "edge-router": edge_router_manifest,
    "carbon-comply": carbon_comply_manifest,
    "budget-copilot": budget_copilot_manifest,
}

registry = REGISTRY
__all__ = ['REGISTRY', 'registry']
