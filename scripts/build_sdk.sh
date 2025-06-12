#!/usr/bin/env bash
# Build and upload Python SDK to TestPyPI
set -euo pipefail

python -m build -C backend
TWINE_USERNAME="__token__"
TWINE_PASSWORD="${TWINE_TOKEN:-}" twine upload --repository testpypi backend/dist/*
