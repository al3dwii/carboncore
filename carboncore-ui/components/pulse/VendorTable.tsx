"use client";
import { Vendor } from "@/types/vendor";
import useSWR from "swr";
import { isBreach } from "@/lib/breach-util";
import { VendorModal } from "./VendorModal";
import { useState } from "react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export function VendorTable() {
  const { data: vendors = [] } = useSWR<Vendor[]>("/api/vendors", fetcher, {
    refreshInterval: 3600_000
  });
  const [modal, setModal] = useState<Vendor | null>(null);

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
              className="border-t border-white/10 hover:bg-white/5 cursor-pointer"
              onClick={() => setModal(v)}
            >
              <td className="py-2 flex items-center gap-2">
                {v.name}
                {isBreach(v) && (
                  <span className="px-2 rounded bg-cc-red text-xs">⚠ breach</span>
                )}
              </td>
              <td>{new URL(v.endpoint).host}</td>
              <td>{v.kgCo2PerK.toFixed(2)} kg</td>
              <td>{v.lastCheck.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && <VendorModal v={modal} onClose={() => setModal(null)} />}
    </>
  );
}
