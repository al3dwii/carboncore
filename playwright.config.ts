import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: 'http://localhost:3000' },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'WebKit',   use: { browserName: 'webkit'   } }
  ],
  webServer: {
    command: 'pnpm dev --port 3000',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  },
  globalSetup: './e2e/global-setup.ts'
});
