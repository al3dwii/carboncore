import { manifest as schema } from "../plugin-schema";
export const manifest = schema.parse({
  id: "eco-shift",
  sidebar: "EcoShift Scheduler",
  icon: "Clock4",
  routes: [{ id:"eco-shift", path:"/tool/eco-shift", component:"ShiftPage" }]
});
