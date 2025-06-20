"use client";
import { useEventSource } from "@/lib/useEventSource";
import { LedgerEventSchema, type LedgerEvent } from "@/lib/schemas";
import { toastSuccess } from "@/lib/toast";
import { useState } from "react";

export default function LedgerTable({
  initial,
  orgId,
}: {
  initial: LedgerEvent[];
  orgId: string;
}) {
  const [rows, setRows] = useState(initial);

  useEventSource<LedgerEvent>(
    `/api/proxy/org/${orgId}/ledger/stream`,
    (e) => {
      const evt = LedgerEventSchema.parse(e);     // zod assert
      setRows((r) => [evt, ...r]);
      toastSuccess(evt.message);
    },
  );

  return (
    <table className="w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left">Time</th>
          <th className="px-4 py-2 text-left">Type</th>
          <th className="px-4 py-2 text-left">Details</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((e) => (
          <tr key={e.id} className="border-t">
            <td className="px-4 py-2">{new Date(e.ts).toLocaleString()}</td>
            <td className="px-4 py-2">{e.kind}</td>
            <td className="px-4 py-2">{e.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
