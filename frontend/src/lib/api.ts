const BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';  // e.g. "https://api.carboncore.dev"

export async function request<T>(
  path: string,
  init: RequestInit = {},
  fallback: RequestInit['method'] = 'GET',
): Promise<T> {
  // (1) HTTP verb
  const verb = (init.method ?? fallback).toUpperCase() as RequestInit['method'];

  // (2) full URL
  const url = new URL(path, BASE).toString();

  // (3) fire
  const res = await fetch(url, {
    ...init,
    method: verb,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`[${verb}] ${url} \u2192 ${res.status}\n${body}`);
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}
