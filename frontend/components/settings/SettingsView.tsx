"use client";
import { SlackForm } from "./SlackForm";
import { WebhookTable } from "./WebhookTable";
import { FeatureFlagsTable } from "./FeatureFlagsTable";

export default function SettingsView({ initial }: { initial: { slack: string; hooks: any[] } }) {
  const { slack, hooks } = initial;
  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div>
        <h2 className="font-semibold mb-2">Slack integration</h2>
        <SlackForm initial={slack ?? ""} />
      </div>
      <div>
        <h2 className="font-semibold mb-2">Webhooks</h2>
        <WebhookTable initial={hooks} />
      </div>
      <div>
        <h2 className="font-semibold mb-2">Feature Flags</h2>
        <FeatureFlagsTable />
      </div>
    </section>
  );
}
