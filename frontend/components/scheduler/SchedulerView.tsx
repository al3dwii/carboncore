"use client";
import SchedulerCalendar from "./Calendar";
import { Job } from "@/types/job";
import { useEventSource } from "@/lib/useEventSource";
import { useState, useEffect } from "react";

export default function SchedulerView({ initial, orgId }: { initial: Job[]; orgId: string }) {
  const [jobs, setJobs] = useState<Job[]>(initial ?? []);
  const [evt] = useEventSource<Job>(`/api/proxy/org/${orgId}/jobs/stream`);

  useEffect(() => {
    if (evt) setJobs((prev) => [evt, ...prev]);
  }, [evt]);

  return <SchedulerCalendar jobs={jobs} />;
}
