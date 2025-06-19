"use client";
import { useEventSource } from "@/lib/useEventSource";
import { toastSuccess } from "@/lib/toast";

interface JobEvent {
  type: string;
  message?: string;
}

export function JobStreamToasts() {
  const events = useEventSource<JobEvent>("/api/jobs/stream");
  if (events.length > 0) {
    const e = events[0];
    if (e.type === "job_rescheduled") {
      toastSuccess(e.message || "Job rescheduled");
    }
  }
  return null;
}
