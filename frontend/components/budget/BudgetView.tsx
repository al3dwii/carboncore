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
  const [evt] = useEventSource<BudgetLine>(
    `/api/proxy/org/${orgId}/budget/stream`,
    { reconnect: true }
  );

  useEffect(() => {
    if (evt) setData(evt);
  }, [evt]);

  return (
    <div className="space-y-6">
      <BudgetChart initial={data} />
      <BudgetAlertToasts />
    </div>
  );
}
