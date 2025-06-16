"use client";
import { useEventSource } from "@/lib/useEventSource";
import { toastError } from "@/lib/toast";

interface AlertEvent {
  vendor: string;
  type: string;
}

export function PulseAlertToasts() {
  const events = useEventSource<AlertEvent>("/api/vendors/stream");
  if (events.length > 0) {
    const e = events[0];
    if (e.type === "breach") {
      toastError(`${e.vendor} breached SLA`);
    }
  }
  return null;
}
