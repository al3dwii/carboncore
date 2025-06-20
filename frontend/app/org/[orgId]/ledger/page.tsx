import { request } from "@/lib/client";
import LedgerTable from "@/components/ledger/Table";

export default async function LedgerPage({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  const events = await request(
    "/org/{orgId}/ledger",
    "get",
    { orgId }
  );
  return <LedgerTable initial={events as any} orgId={orgId} />;
}
