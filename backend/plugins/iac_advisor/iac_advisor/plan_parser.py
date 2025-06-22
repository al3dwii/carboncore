def resources_from_tf(plan: dict):
    """Return iterator of (address, instance_type, region)"""
    for rc in plan.get("resource_changes", []):
        if rc.get("type") != "aws_instance":
            continue
        after = (rc.get("change") or {}).get("after") or {}
        az = after.get("availability_zone", "")
        region = az[:-1] if len(az) > 0 else None
        yield (
            rc.get("address", "unknown"),
            after.get("instance_type"),
            region,
        )
