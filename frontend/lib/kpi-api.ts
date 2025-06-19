import type { KPI } from "@/types/kpi";
import { request } from "./api";

export async function fetchKpis(orgId: string): Promise<KPI[]> {
  return request("/org/{orgId}/kpi", "get", { orgId });
}
