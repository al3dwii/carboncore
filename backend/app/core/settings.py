"""
Runtime configuration for Carbon-Core
(Sprints 3 → 5 ready).

• 12-factor: every value can be overridden via environment variables.
• Typed via pydantic-settings v2.
• Covers all “GA 0 .1” knobs — security, observability, blue-green deploy,
  billing, etc.
"""

from __future__ import annotations

# app/core/settings.py  (or wherever DATABASE_URL is defined)
import os
from functools import lru_cache
from pathlib import Path
from typing import ClassVar, Literal

from app.secret import get_secret

from pydantic_settings import BaseSettings, SettingsConfigDict

# Default to a local SQLite database when no DATABASE_URL is provided so that
# the backend can run without Docker or Postgres. Tests override this value via
# environment variables.
DEFAULT_SQLITE = "sqlite+aiosqlite:///./dev.db"


def _env_bool(name: str, default: str = "false") -> bool:
    """Return a boolean from environment variables."""
    return os.getenv(name, default).lower() == "true"

class Settings(BaseSettings):
    # ─────────────── Infrastructure ───────────────
    # Use SQLite and fakeredis by default so the backend can start without
    # external services. Values are overridden automatically by environment
    # variables in Docker or CI.
    DATABASE_URL: str = os.getenv("DATABASE_URL", DEFAULT_SQLITE)
    REDIS_URL: str = os.getenv("REDIS_URL", "fakeredis://")
    POSTGRES_PASSWORD: str = get_secret().get("POSTGRES_PASSWORD", "")

    @property
    def redis_url(self) -> str:  # noqa: N802 — used by Celery settings
        return self.REDIS_URL

    OTEL_EXPORTER_OTLP_ENDPOINT: str | None = None   # e.g. http://tempo:4318
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    RATE_LIMIT: str = "30/second"                    # global slowapi default
    INSTANCE_ID: str | None = None  
    
    

    @property
    def electricitymaps_api_key(self) -> str | None:      # helper if you want
        return self.ELECTRICITYMAPS_API_KEY or self.ELECTRICITYMAPS_TOKEN                 # set by blue/green deploy

    # ───────────── Security / Auth ─────────────
    PROJECT_TOKEN_HEADER: str = "x-project-token"
    JWT_SECRET: str = "please-change-me"             # rotated in Sprint-4
    JWT_ALG: Literal["HS256", "HS512"] = "HS256"
    SECURE_HEADERS: bool = True                      # CSP + HSTS middleware

    # ───────────── Third-party APIs ─────────────
    ELECTRICITYMAPS_TOKEN: str | None = None  
    ELECTRICITYMAPS_API_KEY: str | None = None  # legacy env-var       # new var name (was *_API_KEY)
    WATTTIME_USERNAME: str | None = None
    WATTTIME_PASSWORD: str | None = None
    STRIPE_SECRET_KEY: str | None = None
    STRIPE_WEBHOOK_SECRET: str | None = None
    SENTRY_DSN: str | None = None                    # error monitoring

    # ───────── Celery & Task Queue ─────────────
    CELERY_BROKER_URL: str = REDIS_URL
    CELERY_BACKEND_URL: str = REDIS_URL
    CELERY_BEAT_TIMEZONE: str = "UTC"

    # ──────────── Observability ───────────────
    PROMETHEUS_EXPORT_PORT: int = 9100
    ENABLE_TRACING: bool = _env_bool("ENABLE_TRACING")
    ENABLE_METRICS: bool = True
    ENABLE_LOG_ENRICH: bool = True                  # structlog processors

    # ───────── Deployment / Ops ───────────────
    ENV: Literal["local", "staging", "prod"] = "local"
    BUILD_SHA: str | None = None                    # injected by CI for traceability
    BLUE_GREEN_COLOR: Literal["blue", "green"] | None = None

    # ───────────────── Paths ──────────────────
    PROJECT_ROOT: Path = Path(__file__).resolve().parents[3]

    # pydantic-settings configuration
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",     # ignore unknown variables
    )


@lru_cache
def get_settings() -> Settings:  # noqa: D401
    """Return a cached singleton Settings instance."""
    return Settings()


# Convenience: import from anywhere without DI
settings: Settings = get_settings()
