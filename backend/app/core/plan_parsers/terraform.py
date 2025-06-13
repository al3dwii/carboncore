from typing import List, Dict

def parse_terraform_plan(doc: dict) -> List[Dict]:
    """Return list of {action, sku, region, count} from Terraform plan."""
    out = []
    for rc in doc.get("resource_changes", []):
        actions = rc.get("change", {}).get("actions", [])
        if "create" not in actions:
            continue
        after = rc["change"].get("after", {})
        out.append({
            "action": "create",
            "sku": after.get("instance_type"),
            "region": after.get("availability_zone"),
            "count": 1,
        })
    return out
