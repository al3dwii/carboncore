import { z } from "zod";
export const route = z.object({
  component: z.string(),
  path: z.string(),
  id: z.string(),
});
export const manifest = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  icon: z.string().optional(),
  sidebar: z.string().optional(),
  routes: z.array(route),
});
export type Manifest = z.infer<typeof manifest>;
