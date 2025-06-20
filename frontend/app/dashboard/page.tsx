import { KpiTile } from "@/components/kpi/KpiTile";
import { LineCard } from "@/components/charts/LineCard";

export default function DashboardPage() {
  const data = [
    { name: "Jan", value: 40 },
    { name: "Feb", value: 32 },
    { name: "Mar", value: 50 }
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <KpiTile label="Users" value={123} />
        <KpiTile label="Sales" value={456} />
      </div>
      <LineCard data={data} />
    </div>
  );
}
