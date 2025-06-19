import { rest, setupWorker } from 'msw';
import mockLedger from './fixtures/ledger.json';

export const handlers = [
  rest.get('/api/ledger', (_req, res, ctx) => res(ctx.json(mockLedger))),
  rest.all(/\/api\/.*/, (_req, res, ctx) => res(ctx.status(200)))
];

export const server = setupWorker(...handlers);
