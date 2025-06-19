import { BudgetLine } from "@/types/budget";

export async function fetchBudget(): Promise<BudgetLine> {
  const r = await fetch("/api/budget/line", { cache: "no-store" });
  if (!r.ok) throw new Error("Budget fetch failed");
  return BudgetLine.parse(await r.json());
}
