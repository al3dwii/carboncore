"use client";
import { useQuery }      from "@tanstack/react-query";
import { fetchPluginStatus } from "@/src/lib/plugins-api";
import { PLUGINS }       from "@/src/constants/plugins";

export function PluginCards({ orgId }: { orgId: string }) {
  const queries = PLUGINS.map((p) =>
    useQuery({
      queryKey: ["plugin", orgId, p.handle],
      queryFn : () => fetchPluginStatus(orgId, p.handle),
      staleTime: 120_000,
    }),
  );

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {PLUGINS.map((p, i) => {
        const { data } = queries[i];
        return (
          <div
            key={p.handle}
            className="rounded border p-4 shadow-sm"
            loading="lazy"
          >
            <div className="text-2xl">{p.emoji}</div>
            <p className="mt-1 font-semibold">{p.name}</p>
            {data ? (
              <>
                <p className="text-xs">
                  {data.enabled ? "Enabled" : "Disabled"}
                </p>
                <p className="text-xs text-neutral-500">
                  Last {data.lastActivity}
                </p>
              </>
            ) : (
              <p className="text-xs text-neutral-400">Loading…</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
