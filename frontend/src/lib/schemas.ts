import { z } from 'zod'

export const AlertEventSchema = z.object({
  vendorId: z.string(),
  severity: z.enum(['low', 'med', 'high']),
  message: z.string(),
})
export type AlertEvent = z.infer<typeof AlertEventSchema>

export const LedgerEventSchema = z.object({
  id: z.string(),
  ts: z.string(),
  kind: z.string(),
  message: z.string(),
});
export type LedgerEvent = z.infer<typeof LedgerEventSchema>;
