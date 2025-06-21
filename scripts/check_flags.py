import json, subprocess, sys, pathlib
meta=json.loads(pathlib.Path("frontend/src/sidebar-meta.ts").read_text().split("=",1)[1])
flags=[f"{m['id'].replace('-','.')}.enabled" for m in meta]
try:
    out=subprocess.check_output(["ldctl","flags","list","--json"])
except FileNotFoundError:
    sys.exit("ldctl not installed")
existing=[f["key"] for f in json.loads(out)]
missing=[f for f in flags if f not in existing]
if missing:
    sys.exit(f"Missing LaunchDarkly flags: {missing}")
