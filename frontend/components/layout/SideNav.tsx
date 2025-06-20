"use client";

import Link from "next/link";
import { useMemo } from "react";

import { useFlags } from "@/lib/useFlags";
import { useOrg }   from "@/lib/useOrg";
import type { NavItem } from "@/lib/nav";

export function SideNav({ items }: { items: NavItem[] }) {
  const { id }      = useOrg();
  const { data }    = useFlags(id);           // nicer name than flagsQuery.data

  /** normalise -> { key: enabled } */
  const flags = useMemo<Record<string, boolean>>(() => {
    if (!data) return {};

    // backend v1: [{ key, enabled }]
    if (Array.isArray(data)) {
      return Object.fromEntries(data.map(f => [f.key, f.enabled]));
    }

    // backend v2: { key: enabled }
    return data as Record<string, boolean>;
  }, [data]);

  return (
    <nav className="px-4 space-y-1">
      {items
        .filter(i => !i.flag || flags[i.flag])
        .map(item => (
          <Link
            key={item.href}
            href={`/org/${id}${item.href}`}
            className="flex items-center gap-3 px-2 py-2 rounded hover:bg-white/10"
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
    </nav>
  );
}
