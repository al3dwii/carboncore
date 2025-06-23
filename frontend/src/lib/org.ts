// src/lib/org.ts   (create or patch)
export function getActiveOrgId(): string {
  // 1. check URL -> /org/[id]/…
  if (typeof window !== "undefined") {
    const m = window.location.pathname.match(/^\/org\/([^/]+)/);
    if (m) return m[1];
  }
  // 2. fallback to localStorage OR hard-code “1” for dev
  return localStorage.getItem("orgId") ?? "1";
}