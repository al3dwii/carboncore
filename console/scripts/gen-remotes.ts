import fs from 'node:fs';
import path from 'node:path';

const roots = fs.readdirSync('plugins');
const remotes = roots
  .filter(id => fs.existsSync(path.join('plugins', id, 'ui')))
  .map(id => `"${id}":"${id}@/remotes/${id}/remoteEntry.js"`);
fs.writeFileSync(
  'console/src/remotes.map.ts',
  `export const remotes={${remotes.join(',')}} as const;\n`,
);
