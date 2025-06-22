import { useQuery } from "@tanstack/react-query";

export function useFlags(orgId?: string) {
  return useQuery({
    queryKey: ["flags", orgId ?? "none"],
    queryFn: async () => {
      if (!orgId) return {};               // <-- ⬅ early-return
      const res = await fetch(`/api/org/${orgId}/flags`);
      if (!res.ok) throw new Error("flags fetch");
      return (await res.json()) as Record<string, boolean>;
    },
    staleTime: 60_000,
  });
}
