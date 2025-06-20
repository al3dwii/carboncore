import BudgetView from "@/components/budget/BudgetView";
import { request } from "@/lib/client";

export default async function BudgetPage({ params:{orgId} }) {
  const data = await request("/org/{orgId}/budget", "get",{orgId});
  return <BudgetView initial={data as any} orgId={orgId} />;
}
