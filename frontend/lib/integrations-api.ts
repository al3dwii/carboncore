import { SlackURL, Webhook } from "@/types/integration";

export async function fetchSlackURL(): Promise<string | null> {
  const res = await fetch("/api/integrations/slack", { cache: "no-store" });
  if (!res.ok) throw new Error("Slack fetch failed");
  return SlackURL.parse(await res.json()).url;
}

export async function saveSlackWebhook(url: string) {
  const res = await fetch("/api/integrations/slack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error("Save failed");
  return res.json();
}

export async function testSlackWebhook() {
  const res = await fetch("/api/integrations/slack/test");
  return res.json();
}

export async function fetchWebhooks(): Promise<Webhook[]> {
  const res = await fetch("/api/integrations/webhooks", { cache: "no-store" });
  if (!res.ok) throw new Error("Hooks fetch failed");
  return Webhook.array().parse(await res.json());
}

export async function createWebhook(url: string): Promise<Webhook> {
  const res = await fetch("/api/integrations/webhooks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!res.ok) throw new Error("Create failed");
  return Webhook.parse(await res.json());
}

export async function deleteWebhook(id: string) {
  const res = await fetch(`/api/integrations/webhooks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete failed");
}
