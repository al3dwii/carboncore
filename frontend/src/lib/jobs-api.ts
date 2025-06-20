import { request } from "@/lib/client";
import qs from "query-string";
import type { Job } from "@/types/job";

export async function fetchJobs(from: string, to: string): Promise<Job[]> {
  return request(
    "/jobs",
    "get",
    { from, to } as any
  ) as Promise<Job[]>;
}

export async function patchJob(id: string, body: Partial<Job>) {
  return request(`/jobs/${id}`, "patch", { id } as any, body) as Promise<Job>;
}
