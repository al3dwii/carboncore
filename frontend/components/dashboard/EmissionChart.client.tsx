"use client";
import { useQuery }               from "@tanstack/react-query";
import { Line }                   from "react-chartjs-2";
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import { fetch30dEmissions }      from "@/src/lib/emissions-api";

Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

export function EmissionChart({ orgId }: { orgId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["emissions", orgId],
    queryFn : () => fetch30dEmissions(orgId),
    staleTime: 60_000,
  });

  if (isLoading || !data) return <ChartSkeleton />;

  const labels = data.map((p) => p.ts.slice(5)); // MM-DD
  const kg     = data.map((p) => p.kg);
  const usd    = data.map((p) => p.usd);

  const ds = (label: string, values: number[], yAxisID: string) => ({
    label,
    data: values,
    tension: 0.4,
    yAxisID,
    fill: false,
  });

  return (
    <Line
      data={{
        labels,
        datasets: [ds("kg CO₂", kg, "kg"), ds("USD burn", usd, "usd")],
      }}
      options={{
        responsive: true,
        scales: {
          kg : { type: "linear", position: "left"  },
          usd: { type: "linear", position: "right" },
        },
      }}
    />
  );
}
