from typing import Dict

from app.schemas.plugins import PluginManifest
from plugins.core.manifest import manifest as core_manifest
from plugins.ecoshift.manifest import manifest as eco_shift_manifest
from plugins.edge_router.manifest import manifest as edge_router_manifest
from plugins.carboncomply.manifest import manifest as carbon_comply_manifest
from plugins.budget.manifest import manifest as budget_copilot_manifest
from plugins.greendev.manifest import manifest as green_dev_manifest
from plugins.ecolabel.manifest import manifest as eco_label_manifest

REGISTRY: Dict[str, PluginManifest] = {
    "core": core_manifest,
    "eco-shift": eco_shift_manifest,
    "edge-router": edge_router_manifest,
    "carbon-comply": carbon_comply_manifest,
    "budget-copilot": budget_copilot_manifest,
    "green-dev": green_dev_manifest,
    "eco-label": eco_label_manifest,
}

registry = REGISTRY
__all__ = ['REGISTRY', 'registry']
