import { z } from 'zod';
import { apiFetch } from './_fetch';

const Message = z.object({
  id: z.string(),
  role: z.enum(['user', 'bot']),
  content: z.string(),
  created_at: z.string(),
});

export type Message = z.infer<typeof Message>;

export async function askGreenDev(
  orgId: string,
  question: string,
  context?: string[],
): Promise<Message[]> {
  return apiFetch(`/org/${orgId}/greendev/chat`, {
    method: 'POST',
    body: JSON.stringify({ question, context }),
  }).then((r) => Message.array().parse(r as any));
}
