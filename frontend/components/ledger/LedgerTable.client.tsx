"use client";
import { VirtualTable } from "@/components/ui/VirtualTable";

export interface LedgerRow {
  id: string;
  ts: string;
  project: string;
  sku: string;
  kwh: number;
  kg: number;
}

export function LedgerTable({ rows }: { rows: LedgerRow[] }) {
  /** define the column functions *inside* the client component */
  const columns = [
    { key: "ts",      header: "Date",   width: 130, cell: (r: LedgerRow) => r.ts },
    { key: "project", header: "Project",width: 160 },
    { key: "sku",     header: "SKU",    width: 140 },
    { key: "kwh",     header: "kWh",    width: 100 },
    { key: "kg",      header: "kg CO₂", width: 100 },
  ];

  return (
    <VirtualTable
      rowHeight={38}
      rows={rows}
      columns={columns}
      height={300}
    />
  );
}
