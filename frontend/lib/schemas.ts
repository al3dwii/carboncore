import { z } from 'zod'

export const AlertEventSchema = z.object({
  vendorId: z.string(),
  severity: z.enum(['low', 'med', 'high']),
  message: z.string(),
})
export type AlertEvent = z.infer<typeof AlertEventSchema>
