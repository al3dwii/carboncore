// import { request } from "@/lib/client";
// import type { BudgetLine } from "@/types/budget";

// export async function fetchBudget(orgId: string): Promise<BudgetLine[]> {
//   return request("/org/{orgId}/budget/line", "get", { orgId }) as Promise<BudgetLine[]>;
// }

import { request } from "@/lib/request";

export interface BudgetSnapshot {
  remaining: number;   // USD left in the monthly carbon budget
  limit:     number;   // original monthly limit
}

/** One-shot endpoint used before SSE kicks in */
export async function fetchCurrentBudget(
  orgId: string,
): Promise<BudgetSnapshot> {
  return request(`/api/org/${orgId}/budget/current`);
}
