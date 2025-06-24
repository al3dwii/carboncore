// vitest.config.ts
import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  /* -------------------------------------------------- *
   *  Module aliases                                    *
   * -------------------------------------------------- */
  resolve: {
    alias: {
      // “@/…”   ->   project root (for components, pages, etc.)
      '@': path.resolve(__dirname, 'src'),

      // “@src/…” -> src/…
      '@src': path.resolve(__dirname, 'src'),

      // “@components/…” -> src/components (handy in app code)
      '@components': path.resolve(__dirname, 'src/components'),

      // “@lib/…” -> src/lib (needed by Sidebar.tsx tests)
      '@lib': path.resolve(__dirname, 'src/lib'),
    },
  },

  /* -------------------------------------------------- *
   *  esbuild – React automatic runtime                 *
   * -------------------------------------------------- */
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },

  /* -------------------------------------------------- *
   *  Vitest settings                                   *
   * -------------------------------------------------- */
  test: {
    // give us global describe / test / expect
    globals: true,

    // jsdom so React components render
    environment: 'jsdom',

    // where to look for tests
    include: ['{app,src,components,__tests__}/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['node_modules', '.next', 'dist', 'out'],

    // runs once before all suites
    setupFiles: ['./tests/setup.ts'],

    // inline the common Testing-Library deps
    server: {
      deps: {
        inline: [/^@testing-library/],
      },
    },
  },
})
