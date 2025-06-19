import { paths }     from "./sdk";
import { getSession } from "next-auth/react";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8001";

type ExtractOk<T> = T extends { responses: { 200: infer R } } ? R : never

export async function request<
  P extends keyof paths,
  M extends keyof paths[P],
>(
  path: P,
  method: M,
  params: paths[P][M] extends { parameters: infer Q } ? Q : never,
  body?: paths[P][M] extends { requestBody: infer B } ? B : never,
): Promise<ExtractOk<paths[P][M]>> {
  // ⬇︎ safely attempt to read the client session
  let token: string | undefined;
  try {
    const ses = await getSession();
    token = (ses as any)?.accessToken;
  } catch {
    /* running in RSC — ignore */
  }

  const url = BASE + (path as string).replace(/\{(\w+)\}/g, (_, k) => (params as any)[k])

  const res = await fetch(url, {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    // you may add `cache:"no-store"` if every call should bypass cache
  })

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
