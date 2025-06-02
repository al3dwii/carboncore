from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ────────── connection strings ──────────
    database_url: str = "postgresql+asyncpg://postgres:postgres@db:5432/carboncore"
    redis_url: str = "redis://redis:6379/0"

    # ───────────── misc headers ─────────────
    project_token_header: str = "x-project-token"

    # ───────── 3rd-party API keys ───────────
    electricitymaps_api_key: str | None = "demo"
    watttime_user: str | None = None          # new in Sprint-2
    watttime_pass: str | None = None

    # ─────────── rate-limit default ─────────
    rate_limit: str = "30/second"             # new in Sprint-2

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> "Settings":            # noqa: F821
    return Settings()
