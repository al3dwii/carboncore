import { faker } from '@faker-js/faker';
import { writeFileSync } from 'node:fs';

const orgs = ['acme', 'globex', 'initech'];
const ledger = Array.from({ length: 500 }, (_, i) => ({
  id: String(i + 1),
  ts: faker.date.recent(14).toISOString(),
  region: 'us-east-1',
  service: 'ec2',
  kwh: faker.number.float({ min: 0.1, max: 5 }),
  co2: faker.number.float({ min: 0.05, max: 3 }),
  usd: faker.number.float({ min: 0.01, max: 1.5 })
}));
writeFileSync('web/tests/msw/fixtures/ledger.json', JSON.stringify(ledger, null, 2));
console.log('Seed data written.');
