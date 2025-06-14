import { manifest as schema } from "../../src/plugin-schema";
export const manifest = schema.parse({
 id:"supply-pulse",
 sidebar:"Supply Pulse",
 icon:"Truck",
 routes:[{id:"supply-pulse",path:"/tool/pulse",component:"PulsePage"}]
});
