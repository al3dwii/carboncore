import { paths } from './sdk'
import { getSession } from 'next-auth/react'

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL!

type ExtractOk<T> = T extends { responses: { 200: infer R } } ? R : never

export async function request<P extends keyof paths, M extends keyof paths[P]>(
  path: P,
  method: M,
  params: paths[P][M] extends { parameters: infer Q } ? Q : never,
  body?: paths[P][M] extends { requestBody: infer B } ? B : never,
): Promise<ExtractOk<paths[P][M]>> {
  const session = await getSession()
  const url = BASE + (path as string).replace(/\{(\w+)\}/g, (_, k) => (params as any)[k])

  const res = await fetch(url, {
    method: (method as string).toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      Authorization: session ? `Bearer ${(session as any).accessToken}` : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
