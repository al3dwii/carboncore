# Frontend Dashboard

## Component tree
- `DashboardLayout` wraps dashboard pages
- `AlertBanner`, `QuickActions`, `KpiGrid`, `EmissionChart`, `LedgerPreview`, `PluginCards`

## Data-flow diagram
Server components fetch initial data via `request()` and pass to client components which use React Query for updates.

## SSE contract
`/api/org/[orgId]/budget/stream` emits `{ remaining: number }` events every 10 seconds.

## React Query cache policy
Queries default to `staleTime` 30s via shared `request` helper and provider.
