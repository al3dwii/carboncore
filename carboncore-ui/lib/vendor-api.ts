import { Vendor } from "@/types/vendor";

export async function fetchVendors(): Promise<Vendor[]> {
  const r = await fetch("/api/vendors", { cache: "no-store" });
  if (!r.ok) throw new Error("Vendor fetch failed");
  return Vendor.array().parse(await r.json());
}

export async function sendRemediationEmail(id: string) {
  const r = await fetch(`/api/vendors/${id}/email`, { method: "POST" });
  if (!r.ok) throw new Error("Email failed");
}
