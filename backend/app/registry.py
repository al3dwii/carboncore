from typing import Dict

from app.schemas.plugins import PluginManifest
from plugins.ecoshift.manifest import manifest as eco_shift_manifest
from plugins.pulse.manifest import manifest as supply_pulse_manifest
from plugins.ecolabel.manifest import manifest as eco_label_manifest
from plugins.core.manifest import manifest as core_manifest
from plugins.budget.manifest import manifest as budget_copilot_manifest
from plugins.carboncomply.manifest import manifest as carbon_comply_manifest
from plugins.greendev.manifest import manifest as green_dev_manifest
from plugins.edge_router.manifest import manifest as edge_router_manifest

REGISTRY: Dict[str, PluginManifest] = {
    "eco-shift": eco_shift_manifest,
    "supply-pulse": supply_pulse_manifest,
    "eco-label": eco_label_manifest,
    "core": core_manifest,
    "budget-copilot": budget_copilot_manifest,
    "carbon-comply": carbon_comply_manifest,
    "green-dev": green_dev_manifest,
    "edge-router": edge_router_manifest,
}

registry = REGISTRY
__all__ = ['REGISTRY', 'registry']
