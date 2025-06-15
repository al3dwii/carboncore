import os, json, functools
from typing import Dict

try:
    import boto3, botocore.exceptions  # prod / staging only
except ModuleNotFoundError:  # unit-tests
    boto3 = None
@functools.lru_cache
def get_secret() -> Dict[str, str]:
    """
    Dev → read from env if AWS creds absent.
    Prod → pull JSON blob from AWS Secrets Manager.
    """
    # 1️⃣ fast path: env var override
    if os.getenv("SKIP_AWS_SECRETS", "false").lower() == "true" or boto3 is None:
        return {
            "POSTGRES_PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "REDIS_URL": os.getenv("REDIS_URL", "redis://redis:6379/0"),
            "SLACK_WEBHOOK": os.getenv("SLACK_WEBHOOK", ""),
        }
    # 2️⃣ try AWS, fall back if credentials missing
    try:
        sm = boto3.client(
            "secretsmanager",
            region_name=os.getenv("AWS_REGION", "us-east-1"),
        )
        return json.loads(
            sm.get_secret_value(
                SecretId=os.getenv("AWS_SECRET_NAME", "carboncore/staging")
            )["SecretString"]
        )
    except botocore.exceptions.NoCredentialsError:
        print("\u26a0  AWS creds not found, falling back to env vars")
        return {
            "POSTGRES_PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres"),
            "REDIS_URL": os.getenv("REDIS_URL", "redis://redis:6379/0"),
            "SLACK_WEBHOOK": os.getenv("SLACK_WEBHOOK", ""),
        }
