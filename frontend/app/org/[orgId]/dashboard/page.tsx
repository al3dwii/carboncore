import { DashboardLayout }  from "@/components/dashboard/DashboardLayout";
import { Suspense }          from "react";
import { fetchKpis }         from "@/src/lib/kpi-api";
import { KpiGrid }           from "@/components/kpi/KpiGrid";
import { QuickActions }      from "@/components/dashboard/QuickActions";
import { AlertBanner }       from "@/components/alerts/AlertBanner";
import { EmissionChart }     from "@/components/dashboard/EmissionChart.client";
import { LedgerPreview }     from "@/components/ledger/LedgerPreview";
import { PageMetrics }       from "@/components/dashboard/PageMetrics.client";
import { PluginCards }       from "@/components/dashboard/PluginCards.client";

export default async function DashboardPage({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  // Server-side fetches (block render until resolved)
  const [kpis, alertCount, initialBudget] = await Promise.all([
    fetchKpis(orgId),
    fetchAlertCount(orgId),
    fetchCurrentBudget(orgId),
  ]);

  return (
    <DashboardLayout>
      <PageMetrics page="dashboard" />
      {/* Row 1 – alerts + quick actions */}
      <AlertBanner count={alertCount} />
      <QuickActions orgId={orgId} />

      {/* Row 2 – KPI grid (includes live RemainingBudget tile) */}
      <KpiGrid
        kpis={kpis.items}
        initialRemaining={initialBudget.remaining}
        orgId={orgId}
      />

      {/* Row 3 – 30 day emissions vs budget chart */}
      <Suspense fallback={<ChartSkeleton />}>
        <EmissionChart orgId={orgId} />
      </Suspense>

      {/* Row 4 – recent ledger events */}
      <LedgerPreview orgId={orgId} />

      {/* Row 5 – plugin status */}
      <PluginCards orgId={orgId} />
    </DashboardLayout>
  );
}
