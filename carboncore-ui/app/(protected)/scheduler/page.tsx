import SchedulerCalendar from "@/components/scheduler/Calendar";
import { fetchJobs } from "@/lib/jobs-api";
import { startOfWeek, endOfWeek } from "date-fns";

export const dynamic = "force-dynamic";

export default async function SchedulerPage() {
  const now = new Date();
  const jobs = await fetchJobs(
    startOfWeek(now, { weekStartsOn: 1 }).toISOString(),
    endOfWeek(now, { weekStartsOn: 1 }).toISOString()
  );

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">EcoShift Scheduler</h1>
      <SchedulerCalendar jobs={jobs} />
    </section>
  );
}
