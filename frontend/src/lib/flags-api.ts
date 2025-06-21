import type { Flag } from "@/types/flag";
import { request } from './request';

export async function fetchFlags(orgId: string): Promise<Flag[]> {
  return request("/org/{orgId}/flags", "get", { orgId }) as Promise<Flag[]>;
}

export async function patchFlag(key: string, enabled: boolean) {
  await request("/flags", "patch", {}, { key, enabled });
}
