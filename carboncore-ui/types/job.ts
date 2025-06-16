import { z } from "zod";

export const Job = z.object({
  id: z.string(),
  project: z.string(),
  region: z.string(),
  start: z.string(),   // ISO
  end: z.string(),     // ISO
  suggestedStart: z.string().optional(),
  co2DeltaPct: z.number().optional()   // -40 means 40 % less CO₂
});
export type Job = z.infer<typeof Job>;
