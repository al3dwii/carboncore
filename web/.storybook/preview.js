import '../src/styles/tokens.css';
import '../src/styles/globals.css';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import dashboard from '../src/mocks/dashboard.json';
import projects from '../src/mocks/projects.json';

initialize();
export const decorators = [mswDecorator];
export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  msw: {
    handlers: [
      [
        'GET',
        '/api/stats/dashboard',
        (req, res, ctx) => res(ctx.json(dashboard)),
      ],
      [
        'GET',
        '/api/projects',
        (req, res, ctx) => res(ctx.json(projects)),
      ],
    ],
  },
};
