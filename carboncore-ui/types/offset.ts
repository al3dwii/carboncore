import { z } from "zod";
export const OffsetPurchase = z.object({
  date: z.string(),
  tonnes: z.number(),
  project: z.string(),
  certHash: z.string()
});
export type OffsetPurchase = z.infer<typeof OffsetPurchase>;
