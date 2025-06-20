import { request } from "@/lib/api";
import { SlackURL, Webhook } from "@/types/integration";

export async function fetchSlackURL(): Promise<string | null> {
  const res = await request("/integrations/slack", "get", {});
  return SlackURL.parse(res).url;
}

export async function saveSlackWebhook(url: string) {
  return request("/integrations/slack", "post", {}, { url });
}

export async function testSlackWebhook() {
  return request("/integrations/slack/test", "get", {});
}

export async function fetchWebhooks(): Promise<Webhook[]> {
  const data = (await request("/integrations/webhooks", "get", {})) as any;
  return Webhook.array().parse(data);
}

export async function createWebhook(url: string): Promise<Webhook> {
  const data = (await request("/integrations/webhooks", "post", {}, { url })) as any;
  return Webhook.parse(data);
}

export async function deleteWebhook(id: string) {
  await request(`/integrations/webhooks/${id}`, "delete", { id } as any);
}
