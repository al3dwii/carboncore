/* ────────────────────────────────────────────────────────────────────────── */
/*  lib/api.ts                                                               */
/*                                                                           */
/*  • Works now with an empty stub sdk.ts                                    */
/*  • Works later with a regenerated OpenAPI SDK – just flip one typedef     */
/*  • Falls back to local fixtures when NEXT_PUBLIC_BACKEND_URL = "mock"     */
/* ────────────────────────────────────────────────────────────────────────── */

import type { paths } from "./sdk";          // 👉  still ok even if sdk.ts is a stub

/* ------------------------------------------------------------------ */
/*  generic helpers                                                   */
/* ------------------------------------------------------------------ */

type HttpVerb = "get" | "post" | "put" | "patch" | "delete" | "options";

/** Extract the 200-OK payload from a given endpoint in the SDK */
type ExtractOk<T> = T extends { responses: { 200: infer R } } ? R : never;

/** ------------------------------------------------------------------ *
 *  Until the backend OpenAPI spec is reachable we relax `P` to string.
 *  🔁  After you regenerate the SDK replace `Path` with `keyof paths`.
 * ------------------------------------------------------------------- */
type Path = keyof paths;

/* ------------------------------------------------------------------ */
/*  runtime constants                                                 */
/* ------------------------------------------------------------------ */

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8001";

/* ------------------------------------------------------------------ */
/*  fixtures for mock mode                                            */
/* ------------------------------------------------------------------ */
/** You can add / edit fixtures at will – they mimic real API shapes. */
const FIXTURES: Record<string, unknown> = {
  "/org/{orgId}/budget": {
    actual: [
      { date: "2025-01-01", tCO2: 12, eur: 900 },
      { date: "2025-02-01", tCO2: 10, eur: 1_800 },
      { date: "2025-03-01", tCO2: 9,  eur: 2_500 }
    ],
    forecast: [
      { date: "2025-04-01", tCO2: 8, eur: 3_200 },
      { date: "2025-05-01", tCO2: 7, eur: 3_900 }
    ],
    budgetEur: 10_000
  },

  "/org/{orgId}/budget/line": {
    actual: [
      { date: "2025-01-01", tCO2: 12, eur: 900 },
      { date: "2025-02-01", tCO2: 10, eur: 1_800 },
      { date: "2025-03-01", tCO2: 9,  eur: 2_500 }
    ],
    forecast: [],
    budgetEur: 10_000
  },

  "/org/{orgId}/kpi": [
    { id: "energy",    label: "kWh",  value: 42_000 },
    { id: "emissions", label: "tCO₂", value: 123.4 }
  ]

  
  // ➕ add more routes as you touch them
};

/* ------------------------------------------------------------------ */
/*  main client function                                              */
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
  /** Optional query-string map – handy from client components */
  query?: Record<string, string | number | boolean>,
): Promise<R> {

  /* ------------------------------------------------------------------ */
  /* 1. mock mode – short-circuit with fixture                          */
  /* ------------------------------------------------------------------ */
  if (BASE === "mock") {
    const key = path as string;                 // keep `/org/{orgId}` pattern
    if (key in FIXTURES) {
      return FIXTURES[key] as R;
    }
    // no fixture yet → avoid crashes
    /* eslint-disable-next-line no-console */
    console.warn("[API] missing fixture for", key);
    return {} as R;
  }

  /* ------------------------------------------------------------------ */
  /* 2. build real URL                                                  */
  /* ------------------------------------------------------------------ */
  // replace path params e.g. /org/{orgId} → /org/1
  let raw = path as string;
  raw = raw.replace(/\{(\w+)\}/g, (_, k) => (params as any)[k]);

  const url = new URL(BASE + raw);
  if (query) {
    Object.entries(query).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }

  /* ------------------------------------------------------------------ */
  /* 3. attach auth token (cookies) on the server side                  */
  /* ------------------------------------------------------------------ */
  let token: string | undefined;
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const jar = cookies();
    token = jar.get("__session")?.value ?? jar.get("__Secure-session")?.value;
  }
  // (in the browser the cookie travels automatically)

  /* ------------------------------------------------------------------ */
  /* 4. perform fetch                                                   */
  /* ------------------------------------------------------------------ */
  const res = await fetch(String(url), {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const msg = `${res.status} ${res.statusText}`;
    console.error("[API]", method.toUpperCase(), url.pathname, msg);
    throw new Error(msg);
  }

  return res.json() as Promise<R>;
}
