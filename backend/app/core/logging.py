"""
Central logging configuration for CarbonCore.

• Emits compact JSON lines to STDOUT (good for Docker, Loki, CloudWatch).  
• Reads log-level from env var `LOG_LEVEL` (default INFO).  
• Unifies std-library and structlog so everything shares the same formatter.

Import **once** at the very top of `main.py`:

    from app.core.logging import init_logging
    init_logging()          # side-effect: activates JSON logs

After that you can simply:

    import structlog
    log = structlog.get_logger()
    log.info("something.happened", extra="field")
"""

from __future__ import annotations

import logging
import os
import sys
from types import FrameType
from typing import Any, Dict

import structlog


# ───────────────────────── helpers ──────────────────────────
def _get_log_level() -> int:
    """Return numeric log-level from env (INFO default)."""
    return logging.getLevelName(os.getenv("LOG_LEVEL", "INFO").upper())


def _configure_structlog(level: int) -> None:  # pragma: no cover
    timestamper = structlog.processors.TimeStamper(fmt="iso", utc=True)

    structlog.configure(
        wrapper_class=structlog.make_filtering_bound_logger(level),
        processors=[
            structlog.processors.add_log_level,
            timestamper,
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer(),
        ],
    )


# ─────────────────────── public API ─────────────────────────
def init_logging() -> None:
    """
    Initialise std-lib + structlog JSON logger.

    Call this **once**—preferably at process start before any import
    that might emit a log record.
    """
    level = _get_log_level()

    # Std-lib basicConfig with *minimal* formatter (structlog adds JSON)
    logging.basicConfig(
        level=level,
        format="%(message)s",
        stream=sys.stdout,
    )

    # Quiet noisy deps unless LOG_LEVEL=DEBUG
    if level > logging.DEBUG:
        for noisy in ("uvicorn.error", "uvicorn.access", "asyncio"):
            logging.getLogger(noisy).setLevel(logging.WARNING)

    _configure_structlog(level)


# Run immediately so any import side-effects still get JSON logs
init_logging()
