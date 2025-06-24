import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/Card";
import { fetchKpis } from "@/lib/kpi-api";

const Sparkline = dynamic(() => import("./Sparkline"), { ssr: false });
export const dynamic = "force-dynamic";

export default function DashboardPage({ params }: { params: { orgId: string } }) {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Content orgId={params.orgId} />
    </Suspense>
  );
}

async function Content({ orgId }: { orgId: string }) {
  const kpis = await fetchKpis(orgId);

  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.items.map(k => (
          <li key={k.name}>
            <Card title={k.name} value={k.value}>
              <Sparkline trend={k.trend} />
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
