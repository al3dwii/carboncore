import { request } from "@/lib/client";
import { Vendor } from "@/types/vendor";

export async function fetchVendors(): Promise<Vendor[]> {
  const data = (await request("/vendors", "get", {})) as any;
  return Vendor.array().parse(data);
}

export async function sendRemediationEmail(id: string) {
  await request(`/vendors/${id}/email`, "post", { id } as any);
}

export async function vendorTrend(orgId: string, vendorId: string) {
  return request(`/org/${orgId}/vendors/${vendorId}/trend?days=30`, 'get');
}
