"use client";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NAV_BY_ROLE } from "@/lib/nav";
import { Icons } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useFlags } from "@/lib/useFlags";

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();
  const { orgId } = useParams() as { orgId: string };
  const { user } = useUser();

  if (!user || !orgId) return null;

  const role = (user.publicMetadata.role as keyof typeof NAV_BY_ROLE) ?? "developer";
  const flags = useFlags(orgId)?.data ?? {};
  const nav = NAV_BY_ROLE[role].filter(i => !i.flag || flags[i.flag]);

  const isActive = (href: string) =>
    pathname?.startsWith(`/org/${orgId}${href}`);

  return (
    <nav className="space-y-1">
      {nav.map(({ href, label, icon }) => {
        const Icon = Icons[icon];
        return (
          <Link
            key={href}
            href={`/org/${orgId}${href}`}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
              "hover:bg-gray-100 dark:hover:bg-zinc-800",
              isActive(href)
                ? "bg-gray-100 font-semibold dark:bg-zinc-800"
                : "text-gray-700 dark:text-gray-300",
            )}
            aria-current={isActive(href) ? "page" : undefined}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
