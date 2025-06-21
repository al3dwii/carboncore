// src/lib/api.ts
export async function request<T = any>(
  path: string,
  paramsOrInit: Record<string, any> | RequestInit = {},
  fallbackMethod = "GET",
): Promise<T> {
  let url = path;
  let init: RequestInit = {};

  // ── 1.  Decide whether we got "params" or a real RequestInit ────────────────
  const looksLikeParams =
    paramsOrInit &&
    typeof paramsOrInit === "object" &&
    !("method" in paramsOrInit) &&
    !("body" in paramsOrInit);

  if (looksLikeParams) {
    const qs = new URLSearchParams(
      paramsOrInit as Record<string, string>,
    ).toString();
    if (qs) url += (url.includes("?") ? "&" : "?") + qs;
  } else {
    init = paramsOrInit as RequestInit;
  }

  // ── 2.  Normalise/upper-case the HTTP method safely ─────────────────────────
  const verb: string =
    typeof init.method === "string" && init.method
      ? init.method
      : fallbackMethod;
  init.method = verb.toUpperCase();

  // ── 3.  Fire the request ────────────────────────────────────────────────────
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    ...init,
  });

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  // 204 = no content, otherwise JSON
  return (res.status === 204 ? undefined : await res.json()) as T;
}
