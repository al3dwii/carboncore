"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarApi } from "@fullcalendar/core";
import { Job } from "@/types/job";
import { useState, useRef } from "react";
import { patchJob } from "@/lib/jobs-api";
import { toastSuccess, toastError } from "@/lib/toast";
import { JobTooltip } from "./JobTooltip";
import { useGridOverlay } from "./GridIntensityOverlay";

export default function SchedulerCalendar({ jobs }: { jobs?: Job[] }) {
  const safe = Array.isArray(jobs) ? jobs : [];
  const [events, setEvents] = useState(() =>
    safe.map((j) => ({
      id: j.id,
      title: j.project,
      start: j.start,
      end: j.end,
      extendedProps: j
    }))
  );
  const calRef = useRef<FullCalendar | null>(null);
  useGridOverlay(calRef.current ? (calRef.current as any).getApi() as CalendarApi : null);

  async function handleDrop(info: any) {
    const { id } = info.event;
    const newStart = info.event.start;
    const ok = confirm(`Reschedule job to ${newStart.toLocaleString()}?`);
    if (!ok) return info.revert();
    try {
      await patchJob(id, { start: newStart.toISOString() });
      toastSuccess("Job rescheduled to greener slot 👍");
    } catch (err) {
      info.revert();
      toastError("Backend rejected reschedule");
    }
  }

  return (
    <FullCalendar
      ref={calRef}
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      nowIndicator
      editable
      events={events}
      eventDrop={handleDrop}
      eventContent={(arg) => <JobTooltip eventArg={arg} />}
      height="auto"
      className="[&_.fc-event]:cursor-move"
      {...({} as any)}
    />
  );
}
