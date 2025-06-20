"use client";

import { Org } from "@/types/org";
import { Menu } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { useMemo } from "react";

/* ------------------------------------------------------------------ */
/* 1 ─ helpers                                                         */

const fetchAsArray = async (url: string): Promise<Org[]> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.warn(`${url} → ${res.status}`);
    return [];                     // swallow 404/500, return empty list
  }

  const json = await res.json();
  // handle both formats:  [{id,name},…]   or   { data:[…] }
  return Array.isArray(json) ? json : (json.data ?? []);
};

/* ------------------------------------------------------------------ */
/* 2 ─ component                                                       */

export function OrgSwitcher({ currentId }: { currentId: string }) {
  const { data: orgs = [] } = useSWR<Org[]>("/api/orgs", fetchAsArray);

  const router = useRouter();
  const path   = usePathname();
  const newOrgPath = (id: string) =>
    path!.replace(`/org/${currentId}`, `/org/${id}`);

  const currentOrg = useMemo(
    () => orgs.find(o => o.id === currentId)?.name ?? "Loading…",
    [orgs, currentId]
  );

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="px-3 py-1 rounded bg-white/10">
        {currentOrg}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 bg-cc-base
                              border border-white/10 rounded max-h-60 overflow-y-auto">
        {orgs.map(o => (
          <Menu.Item key={o.id}>
            {({ active }) => (
              <button
                className={`block w-full text-left px-4 py-2
                            ${active ? "bg-white/10" : ""}`}
                onClick={() => router.replace(newOrgPath(o.id))}
              >
                {o.name}
              </button>
            )}
          </Menu.Item>
        ))}
        {orgs.length === 0 && (
          <p className="px-4 py-2 text-sm text-white/60">No organisations</p>
        )}
      </Menu.Items>
    </Menu>
  );
}
