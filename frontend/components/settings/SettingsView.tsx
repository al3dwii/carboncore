"use client";
import { SlackForm } from "./SlackForm";
import { WebhookTable } from "./WebhookTable";
import { FeatureFlagsTable } from "./FeatureFlagsTable";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SettingsView({ initial }: { initial: { slack: string; hooks: any[] } }) {
  const { slack, hooks } = initial;
  const [threshold, setThreshold] = useState(0);
  const role = "developer";
  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div>
        <h2 className="mb-2 font-semibold">Slack integration</h2>
        <SlackForm initial={slack ?? ""} />
      </div>
      <div>
        <h2 className="mb-2 font-semibold">Webhooks</h2>
        <WebhookTable initial={hooks} />
      </div>
      <div>
        <h2 className="mb-2 font-semibold">Feature Flags</h2>
        <FeatureFlagsTable />
        <ul className="mt-4 text-sm">
          {role === "developer" && (
            <li className="flex items-center justify-between py-2">
              <span>Vendor breach threshold (kg CO₂/1k)</span>
              <input
                type="number"
                value={threshold}
                onChange={e => { setThreshold(+e.target.value); api.patchVendorThreshold(+e.target.value); }}
                className="w-24 rounded border px-2 py-1 text-right"
              />
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
