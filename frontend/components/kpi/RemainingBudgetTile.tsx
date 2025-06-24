"use client";
import { useEventSource } from "@/src/hooks/useEventSource";
import clsx from "clsx";

export function RemainingBudgetTile({
  initial,
  orgId,
}: {
  initial: number;
  orgId: string;
}) {
  const [event] = useEventSource<{ remaining: number }>(
    `/api/org/${orgId}/budget/stream`,
  );
  const remaining = event?.remaining ?? initial;

  return (
    <div
      className={clsx(
        "rounded p-4 shadow-sm",
        remaining < 0 ? "bg-red-100" : "bg-emerald-50",
      )}
    >
      <p className="text-xs text-neutral-500">Remaining monthly budget</p>
      <p className="mt-1 text-3xl font-semibold">{remaining.toFixed(0)} USD</p>
    </div>
  );
}
