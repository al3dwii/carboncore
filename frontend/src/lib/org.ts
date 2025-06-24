// src/lib/org.ts   (create or patch)
export function getActiveOrgId(): string {
  if (typeof window === "undefined") return "1";      // during SSR
  const m = window.location.pathname.match(/^\/org\/([^/]+)/);
  if (m) return m[1];
  const stored = localStorage.getItem("orgId");
  return stored ?? "1";
}