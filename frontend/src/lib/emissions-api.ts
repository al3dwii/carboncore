import { request } from "@/src/lib/request";
export interface EmissionPoint { ts: string; kg: number; usd: number }

export async function fetch30dEmissions(
  orgId: string,
): Promise<EmissionPoint[]> {
  return request(`/api/org/${orgId}/emissions/trailing?days=30`);
}
