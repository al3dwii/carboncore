from typing import Dict

from app.schemas.plugins import PluginManifest
from plugins.core.manifest import manifest as core_manifest

REGISTRY: Dict[str, PluginManifest] = {
    "core": core_manifest,
}

registry = REGISTRY
__all__ = ['REGISTRY', 'registry']
