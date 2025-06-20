import SettingsView from "@/components/settings/SettingsView";
import { request } from "@/lib/api";

export default async function SettingsPage({ params:{orgId} }) {
  const data = await request("/org/{orgId}/settings", "get", { orgId });
  return <SettingsView initial={data as any} />;
}
