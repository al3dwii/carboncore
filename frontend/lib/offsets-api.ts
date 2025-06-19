import { OffsetPurchase } from "@/types/offset";

export async function fetchLedger(): Promise<OffsetPurchase[]> {
  const r = await fetch("/api/offsets/ledger", { cache: "no-store" });
  if (!r.ok) throw new Error("Ledger fetch failed");
  return OffsetPurchase.array().parse(await r.json());
}

export async function fetchThreshold(): Promise<number> {
  const r = await fetch("/api/offsets/threshold", { cache: "no-store" });
  if (!r.ok) throw new Error("Threshold fetch failed");
  const d = await r.json();
  return d.value as number;
}

export async function saveThreshold(v: number) {
  const r = await fetch("/api/offsets/threshold", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value: v })
  });
  if (!r.ok) throw new Error("Save failed");
}

export async function fetchResidual(): Promise<number> {
  const r = await fetch("/api/offsets/residual", { cache: "no-store" });
  if (!r.ok) throw new Error("Residual fetch failed");
  const d = await r.json();
  return d.value as number;
}
