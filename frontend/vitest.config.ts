import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'
import { URL } from 'url'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    exclude: ['e2e/**'],
  },
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
})
