import { z } from "zod";
export const Org = z.object({ id: z.string(), name: z.string() });
export type Org = z.infer<typeof Org>;
