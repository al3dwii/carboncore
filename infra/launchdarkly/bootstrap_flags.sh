#!/usr/bin/env bash
# Bootstrap LaunchDarkly flags for CarbonCore plug-ins
set -euo pipefail

if ! command -v ldctl >/dev/null; then
  echo "ldctl not installed" >&2
  exit 1
fi

PROJECT=${LD_PROJECT:-carboncore}
SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)
ldctl import --project "$PROJECT" "$SCRIPT_DIR/flags.json"
