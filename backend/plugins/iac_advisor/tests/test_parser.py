from plugins.iac_advisor.iac_advisor.plan_parser import resources_from_tf

def test_parser():
    plan = {"resource_changes": [{"type": "aws_instance", "change": {"after": {"instance_type": "m4.large", "availability_zone": "us-east-1a"}}}]}
    items = list(resources_from_tf(plan))
    assert items[0][1] == "m4.large"
