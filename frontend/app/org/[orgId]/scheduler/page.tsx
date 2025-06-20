import SchedulerView from "@/components/scheduler/SchedulerView";
import { request } from "@/lib/api";

export default async function SchedulerPage({ params:{orgId} }) {
  const data = await request("/org/{orgId}/jobs", "get", { orgId });
  return <SchedulerView initial={data as any} orgId={orgId} />;
}
