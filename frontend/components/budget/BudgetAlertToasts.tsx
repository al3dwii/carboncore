"use client";
import { useEventSource } from "@/lib/useEventSource";
import { toastError } from "@/lib/toast";
import { useEffect } from "react";

interface AlertEvent {
  type: string;
  remaining: number;
}

export function BudgetAlertToasts() {
  const [evt] = useEventSource<AlertEvent>(
    "/api/proxy/budget/stream"
  );

  useEffect(() => {
    if (!evt) return;
    if (evt.type === "budget_overshoot") {
      toastError(`Budget exceeded by €${Math.round(-evt.remaining)}`);
      // fire-and-forget side-effect
      fetch("/api/integrations/slack/budget", { method: "POST" }).catch(
        console.error
      );
    }
  }, [evt]);

  return null;
}
