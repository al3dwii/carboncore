import { cookies } from "next/headers";

export const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8001";

export async function request(
  path: string,
  method: string,
  params: Record<string, any> = {},
  body?: any,
): Promise<any> {
  const jwt = cookies().get("__session")?.value;

  const url = BASE + path.replace(/\{(\w+)\}/g, (_, k) => params[k])

  const res = await fetch(url, {
    method: (method as string).toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    // you may add `cache:"no-store"` if every call should bypass cache
  })

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
