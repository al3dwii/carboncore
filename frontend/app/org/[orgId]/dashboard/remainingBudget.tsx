"use client";

import { useEventSource } from "@/lib/useEventSource";

export function RemainingBudgetTile({ initial }: { initial: number }) {
  const ev = useEventSource<{ remaining: number }>("/api/budget/stream");
  const value = ev[0]?.remaining ?? initial;
  const danger = value < 0;
  return (
    <div className={`rounded p-4 ${danger ? "bg-cc-red animate-pulse" : "bg-white/5"}`}>
      <p className="text-sm">Remaining budget</p>
      <p className="font-mono text-2xl">{value.toFixed(0)} €</p>
    </div>
  );
}
