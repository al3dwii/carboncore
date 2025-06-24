"use client";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, Legend } from "recharts";
import { BudgetLine } from "@/types/budget";
import { useEventSource } from "@/lib/useEventSource";
import { useEffect, useState } from "react";

export function BudgetChart({ initial }: { initial: BudgetLine }) {
  const [data, setData] = useState(initial);
  const [evt] = useEventSource<BudgetLine>("/api/proxy/budget/stream");

  useEffect(() => {
    if (evt) setData(evt);
  }, [evt]);

  const merged = data.actual.concat(data.forecast);

  return (
    <LineChart
      width={800}
      height={320}
      data={merged}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      className="mx-auto"
    >
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="eur" stroke="#34d399" dot={false} name="Actual" />
      <Line
        type="monotone"
        dataKey="eur"
        stroke="#fbbf24"
        dot={false}
        strokeDasharray="6 6"
        data={data.forecast}
        name="Forecast"
      />
      <ReferenceLine
        y={data.budgetEur}
        stroke="#f87171"
        strokeDasharray="4 4"
        label="Budget"
      />
    </LineChart>
  );
}
