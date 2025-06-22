import { api } from "@/lib/api";
import { EventTable } from "@/components/EventTable";
import { Suspense } from "react";
import { Loading } from "@/components/Loading";


export const revalidate = 60;

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Content />
    </Suspense>
  );
}

async function Content() {
  const rows = await api.recentAdvisor();
  return (
    <>
      <h1 className="text-xl font-bold mb-4">IaC Advisor</h1>
      <EventTable rows={rows} />
    </>
  );
}
