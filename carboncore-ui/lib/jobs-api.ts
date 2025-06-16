import { Job } from "@/types/job";
import qs from "query-string";

export async function fetchJobs(from: string, to: string): Promise<Job[]> {
  const res = await fetch(`/api/jobs?${qs.stringify({ from, to })}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Jobs fetch failed");
  return Job.array().parse(await res.json());
}

export async function patchJob(id: string, body: Partial<Job>) {
  const res = await fetch(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Reschedule failed");
  return Job.parse(await res.json());
}
