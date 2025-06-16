import { fetchKpis } from "@/lib/kpi-api";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const kpis = await fetchKpis();
  return (
    <section className="grid grid-cols-2 gap-6">
      {kpis.map((k) => (
        <div key={k.label} className="bg-white/5 rounded p-4">
          {k.label}: {k.value}
        </div>
      ))}
    </section>
  );
}
