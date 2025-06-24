// import { request } from "@/src/lib/request";
// export interface EmissionPoint { ts: string; kg: number; usd: number }

// export async function fetch30dEmissions(
//   orgId: string,
// ): Promise<EmissionPoint[]> {
//   return request(`/api/org/${orgId}/emissions/trailing?days=30`);
// }

import { request } from "./request";

export interface EmissionPoint {
  ts: string;   // ISO date, e.g. 2025-06-24
  kg: number;   // kg CO₂
  usd: number;  // burn in USD
}

/** 30-day trailing emissions & spend series for the org */
export async function fetch30dEmissions(
  orgId: string,
): Promise<EmissionPoint[]> {
  return request(`/api/org/${orgId}/emissions/trailing?days=30`);
}
