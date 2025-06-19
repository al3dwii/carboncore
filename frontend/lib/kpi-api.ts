export interface Kpi {
  label: string;
  value: number;
}

export async function fetchKpis(): Promise<Kpi[]> {
  const res = await fetch("/api/kpi", { cache: "no-store" });
  if (!res.ok) throw new Error("KPI fetch failed");
  return res.json();
}
