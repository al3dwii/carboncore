"use client";
import { useState } from "react";
import { saveSlackWebhook, testSlackWebhook } from "@/lib/integrations-api";
import { toastSuccess, toastError } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SlackForm({ initial }: { initial?: string }) {
  const [url, setUrl] = useState(initial ?? "");

  async function handleSave() {
    try {
      await saveSlackWebhook(url);
      const resp = await testSlackWebhook() as any;
      toastSuccess(resp.ok ? "Slack connected!" : "Test failed");
    } catch {
      toastError("Unable to save Slack webhook");
    }
  }

  return (
    <div className="space-y-3 max-w-md">
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://hooks.slack.com/…" />
      <Button onClick={handleSave}>Save & Test</Button>
    </div>
  );
}
