import type { Flag } from "@/types/flag";
import { request } from '@/lib/request';

export async function fetchFlags(orgId: string): Promise<Flag[]> {
  return request(`/api/org/${orgId}/flags`);
}

export async function patchFlag(key: string, enabled: boolean) {
  await request("/flags", "patch", {}, { key, enabled });
}
