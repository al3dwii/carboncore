// import { z } from "zod";

// export const Flag = z.object({
//   key: z.string(),
//   enabled: z.boolean()
// });
// export type Flag = z.infer<typeof Flag>;
export type FlagName =
  | "budget"
  | "router"
  | "scheduler"
  | "offsets"
  | "pulse";

/** Shape returned by GET /api/flags */
export interface Flag {
  name: FlagName;
  enabled: boolean;
}