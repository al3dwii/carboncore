"use client";
import { useEventSource } from "@/lib/useEventSource";
import { BudgetLine } from "@/types/budget";
import { useState, useEffect } from "react";
import { BudgetChart } from "./BudgetChart";
import { BudgetAlertToasts } from "./BudgetAlertToasts";
import { BudgetSettingsModal } from "./BudgetSettingsModal";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function BudgetView({
  initial,
  orgId,
}: {
  initial: BudgetLine;
  orgId: string;
}) {
  const [data, setData] = useState(initial);
  const [showModal, setShowModal] = useState(false);
  const [evt] = useEventSource<BudgetLine>(
    `/api/proxy/org/${orgId}/budget/stream`,
    { reconnect: true }
  );

  useEffect(() => {
    if (evt) setData(evt);
  }, [evt]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Carbon Budget</h1>
        <button onClick={() => setShowModal(true)}>
          <Cog6ToothIcon className="size-5" />
        </button>
      </header>
      <BudgetChart initial={data} />
      <BudgetAlertToasts />
      {showModal && (
        <BudgetSettingsModal budget={data.budgetEur} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
