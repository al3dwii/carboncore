import { manifest as schema } from "../plugin-schema";
export const manifest = schema.parse({
 id:"green-dev",
 sidebar:"GreenDev Bot",
 icon:"Bot",
 routes:[{id:"green-dev", path:"/tool/greendev", component:"GreenDevPage"}]
});
