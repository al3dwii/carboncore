"use client";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Job } from "@/types/job";
import { useState } from "react";
import { patchJob } from "@/lib/jobs-api";
import { toastSuccess, toastError } from "@/lib/toast";
import { JobTooltip } from "./JobTooltip";

export default function SchedulerCalendar({ jobs }: { jobs: Job[] }) {
  const [events, setEvents] = useState(() =>
    jobs.map((j) => ({
      id: j.id,
      title: j.project,
      start: j.start,
      end: j.end,
      extendedProps: j
    }))
  );

  async function handleDrop(info: any) {
    const { id } = info.event;
    const newStart = info.event.start;
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
    />
  );
}
