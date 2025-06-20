import OffsetLedger from "@/components/offsets/OffsetLedger";
import { request }  from "@/lib/client";

export default async function Offsets({ params:{orgId} }) {
  const data = await request("/org/{orgId}/offsets", "get",{orgId});
  return <OffsetLedger initial={data as any} orgId={orgId} />;
}
