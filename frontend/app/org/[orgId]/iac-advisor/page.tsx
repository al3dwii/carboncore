import { api } from "@/lib/api";
import { EventTable } from "@/components/EventTable";


export const revalidate = 60;

export default async function Page() {
  const rows = await api.recentAdvisor();
  return (
    <>
      <h1 className="text-xl font-bold mb-4">IaC Advisor</h1>
      <EventTable rows={rows} />
    </>
  );
}
