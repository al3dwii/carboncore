"use client";
import { useEventSource } from "@/lib/useEventSource";
import { OffsetPurchase } from "@/types/offset";
import { useState } from "react";

export default function OffsetLedger({
  initial,
  orgId,
}: {
  initial: OffsetPurchase[];
  orgId: string;
}) {
  const [rows, setRows] = useState(initial);

  useEventSource<OffsetPurchase>(
    `/api/proxy/org/${orgId}/offsets/stream`,
    (e) => setRows((r) => [e, ...r])
  );

  return (
    <table className="w-full text-sm border-collapse">
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
