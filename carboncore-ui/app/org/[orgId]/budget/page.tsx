import { fetchBudget } from "@/lib/budget-api";
import { BudgetChart } from "@/components/budget/BudgetChart";
import { BudgetAlertToasts } from "@/components/budget/BudgetAlertToasts";
import { getServerSessionWithRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BudgetPage({ params }: { params: { orgId: string } }) {
  const session = await getServerSessionWithRole();
  if (session?.user.role !== "finops") redirect(`/org/${params.orgId}/dashboard`);

  const budget = await fetchBudget();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Carbon Budget Copilot</h1>
      <BudgetChart initial={budget} />
      <BudgetAlertToasts />
    </section>
  );
}
