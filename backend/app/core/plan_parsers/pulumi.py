def parse_pulumi_preview(doc: dict) -> list[dict]:
    """
    Return a list of {action, sku, region, count}.
    Pulumi preview JSON has top-level 'steps' each with an 'op' and 'resource'.
    """
    out = []
    for step in doc.get("steps", []):
        if step["op"] not in {"create", "replace"}:
            continue
        res = step["resource"]
        typ = res["type"]
        region = res["inputs"].get("availabilityZone") or res["provider"]
        sku = res["inputs"].get("instanceType")
        out.append({"action": step["op"], "sku": sku, "region": region, "count": 1})
    return out
