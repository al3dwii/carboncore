import fs from "fs";
import path from "path";
import glob from "glob";
import { manifest as schema } from "./src/plugin-schema.ts";

const manifests = glob
  .sync("plugins/*/manifest.ts")
  .map((f) => {
    const m = require(path.resolve(f)).manifest;
    schema.parse(m);
    return m;
  });

const reg =
  "export const registry=" + JSON.stringify(manifests, null, 2) + " as const;";
fs.writeFileSync("web/src/registry.ts", reg);
const sidebar =
  "export const sidebar=" +
  JSON.stringify(
    manifests.map(({ id, sidebar, icon }) => ({ id, sidebar, icon })),
    null,
    2
  ) +
  " as const;";
fs.writeFileSync("web/src/sidebar-meta.ts", sidebar);
console.log("✅ generated console registry");
