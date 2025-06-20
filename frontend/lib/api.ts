// lib/api.ts
import type { paths } from "./sdk";          // still works with a stub file

/* ------------------------------------------------------------------ */
/*  generic helpers                                                   */
/* ------------------------------------------------------------------ */

type HttpVerb = "get" | "post" | "put" | "patch" | "delete" | "options";

/** Extract the 200-OK payload from the SDK */
type ExtractOk<T> = T extends { responses: { 200: infer R } } ? R : never;

/**
 * Until the backend OpenAPI spec is reachable we relax P to `string`.
 * When you regenerate  sdk.ts  swap it back to: `<P extends keyof paths, …>`
 */
type Path = string; // ← change to keyof paths later

const BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8001";

/* ------------------------------------------------------------------ */
/*  main client                                                       */
/* ------------------------------------------------------------------ */

export async function request<
  P extends Path,
  M extends HttpVerb,
  // prettier-ignore
  Q = paths extends never ? never : (P extends keyof paths ? (paths[P][M] extends { parameters: infer Parms } ? Parms : never) : never),
  B = paths extends never ? never : (P extends keyof paths ? (paths[P][M] extends { requestBody: infer Body } ? Body : never) : never),
  R = paths extends never ? unknown : (P extends keyof paths ? ExtractOk<paths[P][M]> : unknown)
>(
  path: P,
  method: M,
  params: Q,
  body?: B,
  /** Optional query-string object – handy from client components */
  query?: Record<string, string | number | boolean>,
): Promise<R> {
  /* --------------------------------- */
  /* 1. short-circuit mock mode        */
  /* --------------------------------- */
  if (BASE === "mock") return {} as R;

  /* --------------------------------- */
  /* 2. build URL                      */
  /* --------------------------------- */
  let raw = path as string;
  raw = raw.replace(/\{(\w+)\}/g, (_, k) => (params as any)[k]);  // /org/{orgId} → /org/1

  const url = new URL(BASE + raw);
  if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  /* --------------------------------- */
  /* 3. attach auth cookie on server   */
  /* --------------------------------- */
  let token: string | undefined;
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const jar = cookies();
    token =
      jar.get("__session")?.value ??
      jar.get("__Secure-session")?.value;
  }
  // (in the browser the cookie is sent automatically)

  /* --------------------------------- */
  /* 4. fire fetch                     */
  /* --------------------------------- */
  const res = await fetch(String(url), {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const msg = `${res.status} ${res.statusText}`;
    console.error("[API]", method.toUpperCase(), url.pathname, msg);
    throw new Error(msg);
  }
  return res.json() as Promise<R>;
}
