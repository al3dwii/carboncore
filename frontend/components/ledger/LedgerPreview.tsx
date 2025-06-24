import { fetchLedger } from "@/lib/ledger-api";
import { LedgerTable } from "./LedgerTable.client";
import Link from "next/link";

export async function LedgerPreview({ orgId }: { orgId: string }) {
  const rows = await fetchLedger(orgId, 50);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Latest ledger events</h2>
        <Link href={`/org/${orgId}/ledger`} className="text-sm underline">
          View all →
        </Link>
      </div>

      {/* Only serialisable data crosses the boundary */}
      <LedgerTable rows={rows} />
    </div>
  );
}
