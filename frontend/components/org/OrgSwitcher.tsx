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
      <Menu.Button className="rounded bg-white/10 px-3 py-1">
        {currentOrg}
      </Menu.Button>

      <Menu.Items className="bg-cc-base absolute right-0 mt-2
                              max-h-60 overflow-y-auto rounded border border-white/10">
        {orgs.map(o => (
          <Menu.Item key={o.id}>
            {({ active }) => (
              <button
                className={`block w-full px-4 py-2 text-left
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
