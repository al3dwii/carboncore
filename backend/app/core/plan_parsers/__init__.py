from .terraform import parse_terraform_plan
from .pulumi import parse_pulumi_preview
from .cdk import parse_cdk_diff

PARSERS = {
    "terraform": parse_terraform_plan,
    "pulumi": parse_pulumi_preview,
    "cdk": parse_cdk_diff,
}

def auto_parse(plan_json: dict, dialect: str):
    if dialect not in PARSERS:
        raise ValueError(f"Unsupported dialect {dialect}")
    return PARSERS[dialect](plan_json)
