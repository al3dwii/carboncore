import { fetchKpis } from "@/lib/kpi-api";
import { fetchBudget } from "@/lib/budget-api";
import { useEventSource } from "@/lib/useEventSource";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [kpis, budget] = await Promise.all([fetchKpis(), fetchBudget()]);
  const last = budget.actual[budget.actual.length - 1];
  const remaining = budget.budgetEur - last.eur;
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

/** Client component */
function RemainingBudgetTile({ initial }: { initial: number }) {
  "use client";
  const ev = useEventSource<{ remaining: number }>("/api/budget/stream");
  const value = ev[0]?.remaining ?? initial;
  const danger = value < 0;
  return (
    <div className={`rounded p-4 ${danger ? "bg-cc-red animate-pulse" : "bg-white/5"}`}>
      <p className="text-sm">Remaining budget</p>
      <p className="text-2xl font-mono">{value.toFixed(0)} €</p>
    </div>
  );
}
