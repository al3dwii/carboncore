"use client";
import Link             from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useUser }      from "@clerk/nextjs";
import { useFlags }     from "@/lib/useFlags";
import { NAV_BY_ROLE, Role } from "@/lib/nav";
import { cn }           from "@/lib/utils";

export function Sidebar() {
  const pathname       = usePathname();
  const { orgId }      = useParams() as { orgId: string };
  const { data: flags} = useFlags(orgId);
  const { user }       = useUser();
  if (!user) return null;

  // default to developer if metadata missing
  const role: Role = (user.publicMetadata.role as Role) ?? "developer";
  const items       = NAV_BY_ROLE[role].filter(
    (i) => !i.flag || flags?.[i.flag]
  );

  return (
    <aside className="w-56 shrink-0 border-r bg-white p-4">
      <h1 className="mb-6 text-xl font-bold">CarbonCore</h1>
      <nav className="space-y-1">
        {items.map((it) => (
          <Link
            key={it.href}
            href={`/org/${orgId}${it.href}`}
            className={cn(
              "block rounded px-3 py-2 hover:bg-gray-100",
              pathname.startsWith(`/org/${orgId}${it.href}`) && "bg-gray-200 font-semibold"
            )}
          >
            <span className="mr-1">{it.icon}</span>
            {it.label}
          </Link>
        ))}
      </nav>
      <div className="mt-10 text-xs text-gray-500">
        {user.primaryEmailAddress?.emailAddress}
      </div>
    </aside>
  );
}
