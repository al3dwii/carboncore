import fs from 'fs';
import path from 'path';
import { PluginManifest } from './src/plugin-schema';

const pluginsDir = path.join(__dirname, 'plugins');
const outFile = path.join(__dirname, 'src', 'registry.ts');

const registry: Record<string, PluginManifest> = {};
for (const name of fs.readdirSync(pluginsDir, { withFileTypes: true })) {
  if (name.isDirectory()) {
    const manifestPath = path.join(pluginsDir, name.name, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as PluginManifest;
      registry[manifest.id] = manifest;
    }
  }
}
fs.writeFileSync(outFile, `export const registry = ${JSON.stringify(registry, null, 2)};\n`);
console.log(`Wrote ${outFile}`);
