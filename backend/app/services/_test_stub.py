from typing import Final
STUB_GCO2: Final = 406  # deterministic value for tests/CI

async def fetch_intensity(_: str) -> int:  # noqa: D401
    """Offline stub used whenever live tokens are absent."""
    return STUB_GCO2
