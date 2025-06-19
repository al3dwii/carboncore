"use client";
import { useEventSource } from "@/lib/useEventSource";
import { BudgetLine } from "@/types/budget";
import { useState, useEffect } from "react";
import { BudgetChart } from "./BudgetChart";
import { BudgetAlertToasts } from "./BudgetAlertToasts";

export default function BudgetView({
  initial,
  orgId,
}: {
  initial: BudgetLine;
  orgId: string;
}) {
  const [data, setData] = useState(initial);

  useEventSource<BudgetLine>(
    `/api/proxy/org/${orgId}/budget/stream`,
    (e) => setData(e)
  );

  return (
    <div className="space-y-6">
      <BudgetChart initial={data} />
      <BudgetAlertToasts />
    </div>
  );
}
