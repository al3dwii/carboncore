"use client";
import Link from "next/link";

export function AlertBanner({ count }: { count: number }) {
  if (!count) return null;
  return (
    <div className="rounded border border-red-400 bg-red-50 p-4 text-sm">
      🚨 You have <b>{count}</b> unresolved carbon / budget alerts.&nbsp;
      <Link
        href="/alerts"
        className="underline hover:text-red-600"
      >
        View details →
      </Link>
    </div>
  );
}
