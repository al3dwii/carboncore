import { z } from "zod";

export const Point = z.object({
  date: z.string(),
  tCO2: z.number(),
  eur: z.number()
});

export const BudgetLine = z.object({
  actual: z.array(Point),
  forecast: z.array(Point),
  budgetEur: z.number()
});
export type BudgetLine = z.infer<typeof BudgetLine>;
