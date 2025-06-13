def parse_cdk_diff(doc: dict) -> list[dict]:
    """
    CDK diff JSON: resources->{logicalId:{type,metadata,properties}}
    """
    out = []
    for res in doc.get("resources", {}).values():
        if res["type"] != "AWS::EC2::Instance":
            continue
        sku = res["properties"]["InstanceType"]
        region = doc["context"]["availabilityZones"][0]
        out.append({"action": "create", "sku": sku, "region": region, "count": 1})
    return out
