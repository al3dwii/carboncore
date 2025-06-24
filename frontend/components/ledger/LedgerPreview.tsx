import Link from "next/link";
import { fetchLedger } from "@/src/lib/ledger-api";
import { VirtualTable } from "@/components/ui/VirtualTable";

export async function LedgerPreview({ orgId }: { orgId: string }) {
  const rows = await fetchLedger(orgId, 50);

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="text-base font-semibold">Latest ledger events</h2>
        <Link className="text-sm underline" href={`/org/${orgId}/ledger`}>
          View all →
        </Link>
      </div>

      <VirtualTable
        rowHeight={38}
        rows={rows}
        columns={[
          { key: "ts",      header: "Date",    width: 130, cell: (r) => r.ts },
          { key: "project", header: "Project", width: 160 },
          { key: "sku",     header: "SKU",     width: 140 },
          { key: "kwh",     header: "kWh",     width: 100 },
          { key: "kg",      header: "kg CO₂",  width: 100 },
        ]}
        height={300}
      />
    </div>
  );
}
