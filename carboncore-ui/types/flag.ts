import { z } from "zod";

export const Flag = z.object({
  key: z.string(),
  enabled: z.boolean()
});
export type Flag = z.infer<typeof Flag>;
