import { request } from "@/lib/client";
import { Vendor } from "@/types/vendor";

export async function fetchVendors(): Promise<Vendor[]> {
  const data = (await request("/vendors", "get", {})) as any;
  return Vendor.array().parse(data);
}

export async function sendRemediationEmail(id: string) {
  await request(`/vendors/${id}/email`, "post", { id } as any);
}
