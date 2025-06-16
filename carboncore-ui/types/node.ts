import { z } from "zod";

export const EdgeNode = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  lat: z.number(),
  lng: z.number(),
  grid_g_co2_kwh: z.number(),
  avg_latency_ms: z.number()
});
export type EdgeNode = z.infer<typeof EdgeNode>;
