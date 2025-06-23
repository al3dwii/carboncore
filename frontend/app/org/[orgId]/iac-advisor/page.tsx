"use client";
import EventTable from "@/components/advisor/EventTable";
import { EventDetailDialog } from "@/components/advisor/EventDetailDialog";
import { useState } from "react";
import { AsyncStates } from "@/components/ui/AsyncStates";
import { useAdvisorEvents } from "@/lib/useAdvisorEvents";

export default function Page() {
  const { data, error, isLoading } = useAdvisorEvents();
  const [selected, setSelected] = useState<string | null>(null);

  if (isLoading) return <AsyncStates state="loading" />;
  if (error) return <AsyncStates state="error" error="Failed to load events." />;
  if (!data?.length) return <AsyncStates state="empty" message="No advisor events yet." />;

  return (
    <>
      <EventTable rows={data} onRowClick={(id)=>setSelected(id)} />
      {selected && <EventDetailDialog id={selected} onClose={()=>setSelected(null)} />}
    </>
  );
}
