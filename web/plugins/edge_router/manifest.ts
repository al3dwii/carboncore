import { manifest as schema } from "../../src/plugin-schema";
export const manifest = schema.parse({
  id:"edge-router",
  sidebar:"Edge Router",
  icon:"Share2",
  routes:[{id:"edge-router",path:"/tool/edge-router",component:"@eco/edge-ui/Page"}]
});
