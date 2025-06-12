#!/usr/bin/env bash
set -euo pipefail

# Start backend server in background
uvicorn --app-dir backend app.main:app > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Build web console in background
(
  cd web
  pnpm build
) > /tmp/web-build.log 2>&1 &
WEB_PID=$!

trap 'kill $BACKEND_PID $WEB_PID 2>/dev/null || true' EXIT

# Wait for web build to finish
WEB_STATUS=0
BACKEND_STATUS=0
wait $WEB_PID || WEB_STATUS=$?

# Stop backend after web build completes
kill $BACKEND_PID 2>/dev/null || true
wait $BACKEND_PID || BACKEND_STATUS=$?

# Consider termination signals as success
if [ "$BACKEND_STATUS" -ne 0 ] && [ "$BACKEND_STATUS" -ne 130 ] && [ "$BACKEND_STATUS" -ne 143 ]; then
  echo "backend exited with code $BACKEND_STATUS" >&2
  exit 1
fi

if [ "$WEB_STATUS" -ne 0 ]; then
  echo "web build failed with code $WEB_STATUS" >&2
  exit 1
fi

echo "\u2705 smoke-build succeeded"
