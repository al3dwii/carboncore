"use client";
import Link from "next/link";
import { useFlags } from "@/lib/useFlags";
import { useOrg } from "@/lib/useOrg";
import type { NavItem } from "@/lib/nav";

export function SideNav({ items }: { items: NavItem[] }) {
  const { id } = useOrg();
  const flagsQuery = useFlags(id);
  const flags = Object.fromEntries((flagsQuery.data ?? []).map(f => [f.key, f.enabled])) as Record<string, boolean>;
  return (
    <nav className="px-4 space-y-1">
      {items
        .filter((i) => (i.flag ? flags[i.flag] : true))
        .map((item) => (
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
