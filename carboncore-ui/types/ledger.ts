import { z } from "zod";

export const LedgerEvent = z.object({
  id: z.string(),
  ts: z.string(),
  project: z.string(),
  region: z.string(),
  service: z.string(),
  kwh: z.number(),
  co2: z.number(),
  usd: z.number(),
  tag: z.string().optional()
});

export type LedgerEvent = z.infer<typeof LedgerEvent>;
