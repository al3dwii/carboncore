import { request } from "@/lib/client";
import type { BudgetLine } from "@/types/budget";

export async function fetchBudget(orgId: string): Promise<BudgetLine[]> {
  return request("/org/{orgId}/budget/line", "get", { orgId }) as Promise<BudgetLine[]>;
}
