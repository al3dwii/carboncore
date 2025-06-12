#!/usr/bin/env bash
set -euo pipefail

NAMESPACE="carboncore-stg"

# Create namespace if it doesn't exist
kubectl get namespace "$NAMESPACE" >/dev/null 2>&1 || \
  kubectl create namespace "$NAMESPACE"

# Add Bitnami repo for PostgreSQL and Redis charts
helm repo add bitnami https://charts.bitnami.com/bitnami >/dev/null 2>&1 || true
helm repo update

# Deploy PostgreSQL
helm upgrade --install carboncore-postgresql bitnami/postgresql \
  --namespace "$NAMESPACE" \
  --set auth.postgresPassword=postgres \
  --set auth.database=carboncore

# Deploy Redis
helm upgrade --install carboncore-redis bitnami/redis \
  --namespace "$NAMESPACE" \
  --set auth.enabled=false

