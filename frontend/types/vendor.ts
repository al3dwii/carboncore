import { z } from "zod";
export const Vendor = z.object({
  id: z.string(),
  name: z.string(),
  endpoint: z.string(),
  kgCo2PerK: z.number(),
  lastCheck: z.string(),
  breach: z.boolean()
});
export type Vendor = z.infer<typeof Vendor>;
