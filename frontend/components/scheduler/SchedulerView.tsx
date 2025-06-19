"use client";
import SchedulerCalendar from "./Calendar";
import { Job } from "@/types/job";
import { useEventSource } from "@/lib/useEventSource";
import { useState } from "react";

export default function SchedulerView({ initial, orgId }: { initial: Job[]; orgId: string }) {
  const [jobs, setJobs] = useState(initial);

  useEventSource<Job>(
    `/api/proxy/org/${orgId}/jobs/stream`,
    (j) => setJobs((prev) => [j, ...prev])
  );

  return <SchedulerCalendar jobs={jobs} />;
}
