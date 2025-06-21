// src/lib/request.ts
// A tiny proxy that loads the *right* implementation at run-time.
// Works in both the browser bundle and on the server.

type ReqModule = typeof import('./request.client'); // same sig on both sides
type ReqFn = ReqModule['request'];

let implPromise: Promise<ReqFn> | null = null;

async function load(): Promise<ReqFn> {
  if (implPromise) return implPromise; // cached after first call

  implPromise = (async () => {
    if (typeof window === 'undefined') {
      // server – next/headers etc. are allowed
      const mod = await import('./request.server') as ReqModule;
      return mod.request;
    }
    // client – no server-only imports
    const mod = await import('./request.client') as ReqModule;
    return mod.request;
  })();

  return implPromise;
}

/** Call this everywhere – it forwards to the correct implementation. */
export async function request<T = unknown>(
  input: Parameters<ReqFn>[0],
  init?: Parameters<ReqFn>[1],
  fallback?: Parameters<ReqFn>[2],
): Promise<T> {
  const real = await load();
  // eslint-disable-next-line @typescript-eslint/return-await
  return real<T>(input, init);
}
