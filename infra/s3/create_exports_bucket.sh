#!/usr/bin/env bash
# Create the S3 bucket used for CarbonComply exports
set -euo pipefail

BUCKET="carboncore-exports"
REGION=${AWS_REGION:-us-east-1}
SCRIPT_DIR=$(cd -- "$(dirname "$0")" && pwd)

aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" --create-bucket-configuration LocationConstraint="$REGION"
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" --lifecycle-configuration file://$SCRIPT_DIR/lifecycle.json
