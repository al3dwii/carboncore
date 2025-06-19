import BudgetView from "@/components/budget/BudgetView";
import { request } from "@/lib/api";

export default async function BudgetPage({ params:{orgId} }) {
  const data = await request("/org/{orgId}/budget", "get",{orgId});
  return <BudgetView initial={data} orgId={orgId} />;
}
