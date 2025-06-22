"use client";
import { useEventSource } from "@/lib/useEventSource";
import { toastSuccess } from "@/lib/toast";
import { useEffect } from "react";

interface JobEvent {
  type: string;
  message?: string;
}

export function JobStreamToasts() {
  const [evt] = useEventSource<JobEvent>("/api/proxy/_admin/jobs/stream", {
    reconnect: true,
  });

  useEffect(() => {
    if (!evt) return;
    if (evt.type === "job_rescheduled") {
      toastSuccess(evt.message || "Job rescheduled");
    }
  }, [evt]);

  return null;
}
