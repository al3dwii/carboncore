// frontend/src/lib/api.ts
const API_ROOT = process.env.NEXT_PUBLIC_API_PREFIX || "/api";
const VERBS = ["GET","POST","PUT","PATCH","DELETE","HEAD","OPTIONS"] as const;
type Verb = (typeof VERBS)[number];

export async function request(
  path: string,
  // either params object | RequestInit | HTTP verb | null/undefined
  paramsOrInit?: Record<string, any> | RequestInit | Verb | null,
  maybeVerb?: Verb,
  extraInit: RequestInit = {},
) {
  /* ------------------------------------------------------------------ *
   * 1. Figure out what the caller actually passed                      *
   * ------------------------------------------------------------------ */
  let params: Record<string, any> | null = null;
  let init: RequestInit = {};
  let verb: Verb = "GET";

  // string → could be a verb
  if (typeof paramsOrInit === "string" && VERBS.includes(paramsOrInit.toUpperCase() as Verb)) {
    verb  = paramsOrInit.toUpperCase() as Verb;
  } else if (typeof maybeVerb === "string") {
    verb  = maybeVerb.toUpperCase() as Verb;
  }

  // params?
  if (paramsOrInit && typeof paramsOrInit === "object" && !("method" in paramsOrInit)) {
    params = paramsOrInit as Record<string, any>;
  } else if (paramsOrInit && typeof paramsOrInit === "object") {
    init = paramsOrInit as RequestInit;
  }

  init = { ...init, ...extraInit };

  /* ------------------------------------------------------------------ *
   * 2. Build URL (strip {tokens}, add QS)                               *
   * ------------------------------------------------------------------ */
  let url = path.startsWith("http")
    ? path
    : `${API_ROOT}${path.startsWith("/") ? "" : "/"}${path}`.replace(/\{[^}]+\}/g, "");

  if (verb === "GET" && params) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v != null && v !== "")
      qs.append(k, String(v));
    const s = qs.toString();
    if (s) url += (url.includes("?") ? "&" : "?") + s;
  } else if (params) {
    init.body    = JSON.stringify(params);
    init.headers = { "Content-Type": "application/json", ...(init.headers || {}) };
  }

  /* ------------------------------------------------------------------ *
   * 3. Fire                                                              *
   * ------------------------------------------------------------------ */
  const res = await fetch(url, { ...init, method: verb });

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}
