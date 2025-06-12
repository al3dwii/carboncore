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

