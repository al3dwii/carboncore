"""
OpenTelemetry initialisation for CarbonCore.

Import *once* from `main.py` **before** the FastAPI app starts:

    from app.core.otel import init_otel
    init_otel(app, engine)

Required packages (already in pyproject):
• opentelemetry-sdk
• opentelemetry-exporter-otlp
• opentelemetry-instrumentation-fastapi
• opentelemetry-instrumentation-httpx
• opentelemetry-instrumentation-sqlalchemy
"""

from __future__ import annotations

import os
from typing import Optional

from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

_OTEL_INITIALISED = False


def _span_exporter() -> OTLPSpanExporter:
    """
    Create an OTLP/HTTP exporter.

    Env overrides:
    • OTEL_EXPORTER_OTLP_ENDPOINT  (default http://tempo:4318)
    • OTEL_EXPORTER_OTLP_HEADERS   (e.g. "Authorization=Bearer xyz")
    """
    endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://tempo:4318")
    headers = dict(
        h.split("=", 1) for h in os.getenv("OTEL_EXPORTER_OTLP_HEADERS", "").split(",") if h
    )
    return OTLPSpanExporter(endpoint=f"{endpoint}/v1/traces", headers=headers or None)


def init_otel(app: FastAPI, engine: Optional[object] = None) -> None:  # pragma: no cover
    """Boot the OTEL SDK & instrument FastAPI, httpx, SQLAlchemy."""
    global _OTEL_INITIALISED
    if _OTEL_INITIALISED:  # safeguard against double-import
        return

    service_name = os.getenv("OTEL_SERVICE_NAME", "carboncore-backend")
    resource = Resource.create({SERVICE_NAME: service_name})

    provider = TracerProvider(resource=resource)
    provider.add_span_processor(BatchSpanProcessor(_span_exporter()))
    trace.set_tracer_provider(provider)

    # ───────── instrumentations ─────────
    FastAPIInstrumentor.instrument_app(app)
    HTTPXClientInstrumentor().instrument()
    if engine is not None:  # SQLAlchemy 2.x async engine
        SQLAlchemyInstrumentor().instrument(engine=engine)

    _OTEL_INITIALISED = True
