"""
Central place to obtain secrets.

* Local dev / CI:   return values from env-vars (fast, works offline)
* Staging / Prod:   pull JSON blob from AWS Secrets Manager
  (only if valid AWS credentials are present)

Add `BYPASS_AWS_SECRETS=1` to .env.local to force the dev branch.
"""

from __future__ import annotations

import functools
import json
import os
from typing import Dict, Final

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
except ModuleNotFoundError:           # unit-tests, slim builds, etc.
    boto3 = None                      # type: ignore

_DEFAULTS: Final[Dict[str, str]] = {
    "POSTGRES_PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
    "REDIS_URL":         os.getenv("REDIS_URL", "redis://redis:6379/0"),
    "SLACK_WEBHOOK":     os.getenv("SLACK_WEBHOOK", ""),
}


@functools.lru_cache
def get_secret() -> Dict[str, str]:
    """Return a dict with the runtime secrets the app expects."""
    # --- 1️⃣ dev / test / CI fast-path -------------------------------------------------
    if os.getenv("BYPASS_AWS_SECRETS") == "1" or boto3 is None:
        return _DEFAULTS

    # --- 2️⃣ prod / staging: try AWS Secrets Manager -----------------------------------
    try:
        sm = boto3.client(
            "secretsmanager",
            region_name=os.getenv("AWS_REGION", "us-east-1"),
        )
        secret_id = os.getenv("AWS_SECRET_NAME", "carboncore/staging")
        payload = sm.get_secret_value(SecretId=secret_id)["SecretString"]
        return json.loads(payload)
    except NoCredentialsError:
        # Container started without any AWS creds – fall back gracefully
        print("⚠  No AWS credentials detected – using env vars instead")
        return _DEFAULTS
    except ClientError as exc:
        # Wrong secret name / IAM denies access
        print(f"⚠  AWS SecretsManager error ({exc}); using env vars instead")
        return _DEFAULTS
