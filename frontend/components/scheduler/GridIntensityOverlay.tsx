import { CalendarApi } from "@fullcalendar/core";
import { useEffect } from "react";
import { getGridIntensity } from "@/lib/api/grid";
import { useOrg } from "@/contexts/OrgContext";

export function useGridOverlay(cal: CalendarApi | null) {
  const { id: orgId } = useOrg();
  useEffect(() => {
    if (!cal) return;
    getGridIntensity(orgId, cal.view.activeStart, cal.view.activeEnd)
       .then(slots => {
         cal.getEvents().forEach(e => {
           const slot = slots.find(s => e.start! >= s.start && e.start! < s.end);
           if (!slot) return;
           e.setProp("classNames", slot.clean ? ["!bg-green-100"] : ["!bg-red-50"]);
         });
       });
  }, [cal, cal?.view.activeStart.valueOf(), orgId]);
}
