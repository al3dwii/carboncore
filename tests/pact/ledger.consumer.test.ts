import { Pact } from '@pact-foundation/pact';
import path from 'path';
import { fetchLedger } from '@/lib/ledger-api';

const provider = new Pact({
  consumer: 'CarbonCore-UI',
  provider: 'CarbonCore-API',
  dir: path.resolve(process.cwd(), 'pacts'),
  port: 1234
});

describe('GET /ledger pact', () => {
  beforeAll(() =>
    provider.setup().then(() =>
      provider.addInteraction({
        state: 'ledger has 2 events',
        uponReceiving: 'a request for last 50 events',
        withRequest: { method: 'GET', path: '/ledger', query: 'limit=50' },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
          body: [{ id: '1' }, { id: '2' }]
        }
      })
    )
  );

  it('matches contract', async () => {
    const res = await fetchLedger(50, 'http://localhost:1234');
    expect(res.length).toBe(2);
    await provider.verify();
  });

  afterAll(() => provider.finalize());
});
