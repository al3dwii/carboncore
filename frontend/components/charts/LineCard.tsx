"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function LineCard({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#28A745" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
