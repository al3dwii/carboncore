"use client";
import Link from "next/link";
import { useUser }     from "@clerk/nextjs";
import { useFlags } from "@/lib/useFlags";         // react-query wraps /flags
import { usePathname, useParams } from "next/navigation";
import { cn } from "./ui";

const NAV = [
  { id: "dashboard", label: "Dashboard", flag: null },
  { id: "ledger",    label: "Ledger",    flag: null },
  { id: "budget",    label: "Budget",    flag: "budget" },
  { id: "offsets",   label: "OffsetSync",flag: "offsets" },
  { id: "pulse",     label: "Pulse",     flag: "pulse" },
  { id: "router",    label: "Router",    flag: "router" },
  { id: "scheduler", label: "Scheduler", flag: "scheduler" },
  { id: "settings",  label: "Settings",  flag: null },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { orgId } = useParams() as { orgId: string };
  const { data: flags } = useFlags(orgId);
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) return null;

  return (
    <aside className="w-56 border-r bg-white p-4">
      <h2 className="mb-6 text-xl font-bold">CarbonCore</h2>
      <nav className="space-y-2">
        {NAV.filter(i => !i.flag || flags?.[i.flag]).map(item => (
          <Link
            key={item.id}
            href={`/org/${orgId}/${item.id}`}
            className={cn(
              "block rounded px-3 py-2 hover:bg-gray-100",
              pathname.includes(item.id) && "bg-gray-200 font-semibold",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 text-xs text-gray-500">
        logged in as {user?.primaryEmailAddress?.emailAddress}
      </div>
    </aside>
  );
}
