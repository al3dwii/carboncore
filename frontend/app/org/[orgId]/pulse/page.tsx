import PulseVendors from "@/components/pulse/VendorTable";
import { request }  from "@/lib/client";

export default async function Pulse({ params:{orgId} }) {
  const vendors = await request("/org/{orgId}/vendors", "get",{orgId});
  return <PulseVendors initial={vendors as any} orgId={orgId} />;
}
