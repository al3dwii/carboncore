"use client";
import { useEventSource } from "@/lib/useEventSource";
import { toastError } from "@/lib/toast";
import { useEffect } from "react";

interface AlertEvent {
  vendor: string;
  type: string;
}

export function PulseAlertToasts() {
  const [evt] = useEventSource<AlertEvent>("/api/proxy/vendors/stream");

  useEffect(() => {
    if (!evt) return;
    if (evt.type === "breach") {
      toastError(`${evt.vendor} breached SLA`);
    }
  }, [evt]);

  return null;
}
