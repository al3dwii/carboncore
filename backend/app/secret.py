import os, json, boto3, functools
@functools.lru_cache
def get_secret():
    sm = boto3.client("secretsmanager", region_name="us-east-1")
    return json.loads(sm.get_secret_value(SecretId="carboncore/staging")["SecretString"])
