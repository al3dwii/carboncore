#!/usr/bin/env bash
set -e
psql $PG_DSN <<'SQL'
INSERT INTO regions(code, name) VALUES
  ('EU_DE', 'Germany'), ('EU_FR', 'France'), ('US_CA', 'California')
ON CONFLICT DO NOTHING;

INSERT INTO grid_intensity(region, ts, g_co2_kwh) VALUES
  ('EU_DE', NOW(), 450),
  ('EU_FR', NOW(), 60),
  ('US_CA', NOW(), 200);

INSERT INTO cloud_skus(sku, price_usd_hr, watts)
VALUES ('m5.large', 0.096, 80), ('m7g.medium', 0.05, 40)
ON CONFLICT DO NOTHING;
SQL

echo '🔧 seeded 3 regions + 2 SKUs'

cat > scripts/sample_pr_plan.json <<'EOF2'
{
  "resource_changes": [{
    "type":"aws_instance",
    "change": {
      "actions": ["create"],
      "after":{"instance_type":"m5.large","availability_zone":"eu-central-1a"}
    }
  }]
}
EOF2

echo '📝 sample plan written to scripts/sample_pr_plan.json'
