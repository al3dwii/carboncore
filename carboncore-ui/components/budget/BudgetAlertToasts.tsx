"use client";
import { useEventSource } from "@/lib/useEventSource";
import { toastError } from "@/lib/toast";

interface AlertEvent {
  type: string;
  remaining: number;
}

export function BudgetAlertToasts() {
  const events = useEventSource<AlertEvent>("/api/budget/stream");
  if (events.length > 0) {
    const e = events[0];
    if (e.type === "budget_overshoot") {
      toastError(`Budget exceed by €${Math.round(-e.remaining)}`);
      fetch("/api/integrations/slack/budget", { method: "POST" });
    }
  }
  return null;
}
