import { manifest as schema } from "../../src/plugin-schema";
export const manifest = schema.parse({
 id:"carbon-comply",
 sidebar:"CarbonComply",
 icon:"FileSpreadsheet",
 routes:[{id:"carbon-comply",path:"/tool/carbon-comply",component:"ComplyPage"}]
});
