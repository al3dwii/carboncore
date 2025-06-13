# Infrastructure

This directory contains Helm charts and helper scripts.

## Quickstart

Use `quickstart.sh` to spin up dependencies in a Kubernetes cluster.
It creates the `carboncore-stg` namespace and deploys PostgreSQL and
Redis using the Bitnami Helm charts.

```bash
./quickstart.sh
```

Ensure `helm` and `kubectl` point to your cluster before running the script.


## LaunchDarkly flags

The `launchdarkly/` folder contains an export of feature flags used by the
application. Run `bootstrap_flags.sh` to import them into your project:

```bash
cd infra/launchdarkly && ./bootstrap_flags.sh
```

## S3 exports bucket

CarbonComply writes XLSX exports to an S3 bucket. Provision it once with the
helper script below (requires the AWS CLI):

```bash
cd infra/s3 && ./create_exports_bucket.sh
```

The bucket is named `carboncore-exports` and expires objects after 30 days.
