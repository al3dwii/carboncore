"use client";
import { Vendor } from "@/types/vendor";
import { useEventSource } from "@/lib/useEventSource";
import { isBreach } from "@/lib/breach-util";
import { VendorModal } from "./VendorModal";
import { useState, useEffect } from "react";

export default function VendorTable({
  initial,
  orgId,
}: {
  initial: Vendor[];
  orgId: string;
}) {
  const [vendors, setVendors] = useState<Vendor[]>(initial ?? []);
  const [modal, setModal] = useState<Vendor | null>(null);

  const [evt] = useEventSource<Vendor>(
    `/api/proxy/org/${orgId}/vendors/stream`,
    { reconnect: true }
  );

  useEffect(() => {
    if (evt) setVendors((r) => [evt, ...r]);
  }, [evt]);

  return (
    <>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-white/60">
            <th className="py-2">Vendor</th>
            <th>Endpoint</th>
            <th>CO₂/1k</th>
            <th>Last check</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v) => (
            <tr
              key={v.id}
              className="cursor-pointer border-t border-white/10 hover:bg-white/5"
              onClick={() => setModal(v)}
            >
              <td className="flex items-center gap-2 py-2">
                {v.name}
                {isBreach(v) && (
                  <span className="bg-cc-red rounded px-2 text-xs">⚠ breach</span>
                )}
              </td>
              <td>{new URL(v.endpoint).host}</td>
              <td>{v.kgCo2PerK.toFixed(2)} kg</td>
              <td>{v.lastCheck.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && <VendorModal v={modal} orgId={orgId} onClose={() => setModal(null)} />}
    </>
  );
}
