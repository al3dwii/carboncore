#!/bin/sh
npx --yes openapi-typescript http://localhost:8000/openapi.json -o frontend/src/types.ts
