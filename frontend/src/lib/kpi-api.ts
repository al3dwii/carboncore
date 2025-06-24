import { request } from "@/src/lib/request";
import type { Kpi } from "@/src/types/kpi";

export async function fetchKpis(orgId: string): Promise<{ items: Kpi[] }> {
  return request(`/api/org/${orgId}/kpi`);
}
