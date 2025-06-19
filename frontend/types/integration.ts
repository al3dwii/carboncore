import { z } from "zod";

export const Webhook = z.object({
  id: z.string(),
  url: z.string()
});
export type Webhook = z.infer<typeof Webhook>;

export const SlackURL = z.object({ url: z.string().nullable() });
export type SlackURL = z.infer<typeof SlackURL>;
