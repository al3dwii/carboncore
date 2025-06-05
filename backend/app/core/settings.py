"""
Runtime configuration for CarbonCore (Sprints 3-5 ready).

• 12-factor: every value can be overridden via environment variables.
• Typed via pydantic-settings (v2).
• Covers all knobs required through the v0.1 GA roadmap
  – security, observability, blue-green deploy, billing, etc.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import ClassVar, Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ─────────── Infrastructure ───────────
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@db:5432/carboncore"
    )
    REDIS_URL: str = "redis://redis:6379/0"

    @property
    def redis_url(self) -> str:  # noqa: N802
        """Alias for Celery configuration."""
        return self.REDIS_URL
    OTEL_EXPORTER_OTLP_ENDPOINT: str | None = None       # e.g. http://tempo:4318
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    RATE_LIMIT: str = "30/second"                        # global slowapi default
    INSTANCE_ID: str | None = None                       # set by blue-/green deploy

    # ─────────── Security / Auth ───────────
    PROJECT_TOKEN_HEADER: str = "x-project-token"
    JWT_SECRET: str = "please-change-me"                 # rotated in Sprint-4
    JWT_ALG: Literal["HS256", "HS512"] = "HS256"
    SECURE_HEADERS: bool = True                          # CSP / HSTS middleware

    # ─────────── Third-party APIs ───────────
    ELECTRICITYMAPS_API_KEY: str | None = "demo"
    WATTTIME_USER: str | None = None
    WATTTIME_PASS: str | None = None
    STRIPE_SECRET_KEY: str | None = None
    STRIPE_WEBHOOK_SECRET: str | None = None
    SENTRY_DSN: str | None = None                        # error monitoring

    # ───────── Celery & Task Queue ─────────
    CELERY_BROKER_URL: str = REDIS_URL
    CELERY_BACKEND_URL: str = REDIS_URL
    CELERY_BEAT_TIMEZONE: str = "UTC"

    # ─────────── Observability ────────────
    PROMETHEUS_EXPORT_PORT: int = 9100
    ENABLE_TRACING: bool = True
    ENABLE_METRICS: bool = True
    ENABLE_LOG_ENRICH: bool = True                       # structlog processors

    # ───────── Deployment / Ops ───────────
    ENV: Literal["local", "staging", "prod"] = "local"
    BUILD_SHA: str | None = None                         # injected by CI for traceability
    BLUE_GREEN_COLOR: Literal["blue", "green"] | None = None

    # ───────────── Paths ─────────────
    PROJECT_ROOT: Path = Path(__file__).resolve().parents[3]

    # pydantic-settings configuration
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",          # ignore unknown env vars
    )


@lru_cache
def get_settings() -> Settings:      # noqa: D401
    """Return a singleton Settings instance (cached)."""
    return Settings()


# Convenience export for modules that don’t use DI
settings: Settings = get_settings()
