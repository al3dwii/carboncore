import '../src/styles/tokens.css';
import '../src/styles/globals.css';
import type { Preview } from '@storybook/react';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { ThemeProvider } from 'next-themes';
import dashboard from '../src/mocks/dashboard.json';
import projects from '../src/mocks/projects.json';

initialize();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on.*' },
    msw: {
      handlers: [
        ['GET', '/api/stats/dashboard', (req, res, ctx) => res(ctx.json(dashboard))],
        ['GET', '/api/projects', (req, res, ctx) => res(ctx.json(projects))],
      ],
    },
  },
  decorators: [
    mswDecorator,
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="bg-cc-base min-h-screen p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
