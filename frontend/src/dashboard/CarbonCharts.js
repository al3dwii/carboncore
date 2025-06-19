import { useEffect, useState } from "react";
import { LineChart, Line, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";

// type Point = { ts: string; value: number };

export default function CarbonCharts() {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    fetch("/api/carbon/snapshots?limit=100")
      .then((r) => r.json())
      .then(setPoints);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Grid CO₂ intensity – last 100 samples</h2>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={points}>
          <XAxis dataKey="ts" hide />
          <YAxis unit=" g" />
          <Tooltip />
          <Line type="monotone" dataKey="value" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
