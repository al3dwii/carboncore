import { fetchKpis } from "@/lib/kpi-api";
import { fetchBudget } from "@/lib/budget-api";
import { RemainingBudgetTile } from "./remainingBudget";

export const dynamic = "force-dynamic";

export default async function Dashboard({ params: { orgId } }: { params: { orgId: string } }) {
  const [kpis, budget] = await Promise.all([fetchKpis(orgId), fetchBudget(orgId)]);
  const last = (budget as any).actual[(budget as any).actual.length - 1];
  const remaining = (budget as any).budgetEur - last.eur;
  return (
    <section className="grid grid-cols-2 gap-6">
      <RemainingBudgetTile initial={remaining} />
      {kpis.map((k) => (
        <div key={k.label} className="bg-white/5 rounded p-4">
          {k.label}: {k.value}
        </div>
      ))}
    </section>
  );
}
