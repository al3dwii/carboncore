import type { Flag } from "@/types/flag";
import { request } from "./api";

export async function fetchFlags(orgId: string): Promise<Flag[]> {
  return request("/org/{orgId}/flags", "get", { orgId });
}

export async function patchFlag(key: string, enabled: boolean) {
  await fetch(`/api/flags`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, enabled })
  });
}
