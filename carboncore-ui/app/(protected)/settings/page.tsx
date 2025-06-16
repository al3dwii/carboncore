import { SlackForm } from "@/components/settings/SlackForm";
import { WebhookTable } from "@/components/settings/WebhookTable";
import { fetchSlackURL, fetchWebhooks } from "@/lib/integrations-api";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [slack, hooks] = await Promise.all([fetchSlackURL(), fetchWebhooks()]);
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
    </section>
  );
}
