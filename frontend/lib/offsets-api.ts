import { request } from "@/lib/api";
import { OffsetPurchase } from "@/types/offset";

export async function fetchLedger(): Promise<OffsetPurchase[]> {
  const data = (await request("/offsets/ledger", "get", {})) as any;
  return OffsetPurchase.array().parse(data);
}

export async function fetchThreshold(): Promise<number> {
  const d = (await request("/offsets/threshold", "get", {})) as any;
  return (d as any).value as number;
}

export async function saveThreshold(v: number) {
  await request("/offsets/threshold", "patch", {}, { value: v });
}

export async function fetchResidual(): Promise<number> {
  const d = (await request("/offsets/residual", "get", {})) as any;
  return (d as any).value as number;
}
