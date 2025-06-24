const LOCAL_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  (process.env.NODE_ENV === 'production'
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

type Verb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export async function request<T = unknown>(
  input: string,
  init: RequestInit & { revalidate?: number } = {},
  fallback: Verb = 'GET',
): Promise<T> {
  const url =
    input.startsWith('http')
      ? input
      : new URL(input.startsWith('/') ? input : `/${input}`, LOCAL_BASE).href;

  init.method = (init.method ?? fallback).toUpperCase();

  /* ──  only when *actually* running on the server ─────────────── */
  let cookieHeaders: Record<string, string> = {};
  if (typeof window === 'undefined') {
    const { headers } = await import('next/headers'); // ★ dynamic
    cookieHeaders = Object.fromEntries(headers());
  }

  const res = await fetch(url, {
    credentials: 'include',
    next: { revalidate: init?.revalidate ?? 30 },
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...cookieHeaders,
      ...init.headers,
    },
  });

  if (!res.ok) throw new Error(`[${res.status}] ${res.statusText} @ ${url}`);
  return res.headers.get('content-type')?.includes('application/json')
    ? res.json()
    : (res.text() as unknown as T);
}
