import { request } from "../../src/lib/request";
// import type { Alert } from "@/src/types/alerts";

export async function fetchAlertCount(orgId: string): Promise<number> {
  const res = await request<{ count: number }>(
    `/api/org/${orgId}/alerts?status=open&limit=0`,
  );
  return res.count;
}

export async function fetchAlerts(orgId: string): Promise<any[]> {
  return request(`/api/org/${orgId}/alerts?status=open`);
}
