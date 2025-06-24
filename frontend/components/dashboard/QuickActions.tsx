"use client";

import Link from "next/link";

export function QuickActions({ orgId }: { orgId?: string }) {
  return (
    <div className="flex gap-3">
      <Link
        href={orgId ? `/org/${orgId}/ledger/new` : "#"}
        className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        + Log saving
      </Link>
      <Link
        href={orgId ? `/org/${orgId}/reports` : "#"}
        className="rounded border px-4 py-2 text-sm hover:bg-neutral-50"
      >
        Generate report
      </Link>
    </div>
  );
}
