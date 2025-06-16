import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Job } from "@/types/job";
import { format } from "date-fns";

export function JobTooltip({ eventArg }: { eventArg: any }) {
  const j = eventArg.event.extendedProps as Job;
  const pct = j.co2DeltaPct ?? 0;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>{eventArg.timeText} • {eventArg.event.title}</div>
      </TooltipTrigger>
      {pct !== 0 && (
        <TooltipContent className="bg-cc-base p-3 rounded text-sm">
          {pct < 0 ? "Move here to cut " : "Moving adds "}
          {Math.abs(pct)} % CO₂
          {j.suggestedStart && (
            <div className="mt-1 text-white/60">
              Suggested: {format(new Date(j.suggestedStart), "EEE HH:mm")}
            </div>
          )}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
