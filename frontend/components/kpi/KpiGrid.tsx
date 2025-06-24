import { KpiTile } from "./KpiTile";
import { RemainingBudgetTile } from "./RemainingBudgetTile";

export function KpiGrid({
  kpis,
  initialRemaining,
  orgId,
}: {
  kpis: { name: string; value: number | string; unit?: string }[];
  initialRemaining: number;
  orgId: string;
}) {
  // Inject remaining-budget as first tile
  const tiles = [
    {
      component: (
        <RemainingBudgetTile
          initial={initialRemaining}
          orgId={orgId}
          key="remaining"
        />
      ),
    },
    ...kpis.map((k) => ({
      component: (
        <KpiTile key={k.name} label={k.name} value={k.value} unit={k.unit} />
      ),
    })),
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {tiles.map((t) => t.component)}
    </div>
  );
}
