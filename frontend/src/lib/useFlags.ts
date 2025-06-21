import { useQuery } from "@tanstack/react-query";
import { request } from './request';
import type { Flag } from "@/types/flag";

export function useFlags(orgId: string) {
  return useQuery({
    queryKey: ["flags", orgId],
    queryFn: () =>
      request("/org/{orgId}/flags", "get", { orgId }) as Promise<Flag[]>,
  });
}
