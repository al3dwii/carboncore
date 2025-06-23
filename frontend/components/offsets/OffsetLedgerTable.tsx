"use client";
import { OffsetPurchase } from "@/types/offset";
import useSWR from "swr";
import { fetchLedger } from "@/lib/offsets-api";

const fetcher = () => fetchLedger();

export function OffsetLedgerTable() {
  const { data: rows = [] } = useSWR<OffsetPurchase[]>("/api/offsets/ledger", fetcher, {
    refreshInterval: 60_000
  });

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="text-left text-white/60">
          <th className="py-2">Date</th>
          <th>Tonnes</th>
          <th>Project</th>
          <th>Cert hash</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-white/10">
            <td className="py-2">{r.date.slice(0, 10)}</td>
            <td>{r.tonnes.toFixed(2)}</td>
            <td>{r.project}</td>
            <td className="font-mono text-xs">{r.certHash.slice(0, 8)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
