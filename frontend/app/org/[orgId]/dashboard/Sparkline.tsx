"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale } from "chart.js";
ChartJS.register(LineElement, PointElement, CategoryScale);

export default function Sparkline({ trend }: { trend: number[] }) {
  if (!trend?.length) return null;
  return (
    <Line
      height={40}
      data={{ labels: trend.map((_, i) => i), datasets: [{ data: trend }] }}
      options={{
        elements: { point: { radius: 0 } },
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales : { x: { display: false }, y: { display: false } },
        maintainAspectRatio: false,
      }}
    />
  );
}
