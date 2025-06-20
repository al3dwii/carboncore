"use client";
import { useState } from "react";
import { createWebhook, deleteWebhook } from "@/lib/integrations-api";
import { Webhook } from "@/types/integration";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toastError, toastSuccess } from "@/lib/toast";

export function WebhookTable({ initial }: { initial: Webhook[] }) {
  const [hooks, setHooks] = useState(initial);
  const [url, setUrl] = useState("");

  async function add() {
    try {
      const hook = await createWebhook(url);
      setHooks([hook, ...hooks]);
      setUrl("");
      toastSuccess("Webhook saved");
    } catch {
      toastError("Failed to create webhook");
    }
  }

  async function remove(id: string) {
    try {
      await deleteWebhook(id);
      setHooks(hooks.filter((h) => h.id !== id));
    } catch {
      toastError("Delete failed");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 max-w-md">
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/hook" />
        <Button onClick={add}>Add</Button>
      </div>
      <ul className="space-y-2">
        {hooks.map((h) => (
          <li key={h.id} className="flex justify-between bg-white/5 px-3 py-1 rounded">
            <span className="truncate mr-2">{h.url}</span>
            <Button variant="ghost" size="sm" onClick={() => remove(h.id)} {...({} as any)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
