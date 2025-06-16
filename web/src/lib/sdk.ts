// web/src/lib/sdk.ts
import { YourGeneratedClient } from '@your-org/generated-sdk'

export const sdk = new YourGeneratedClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000',
  // …any other config…
})
