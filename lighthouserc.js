module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/org/acme/dashboard'],
      numberOfRuns: 3,
      startServerCommand: 'pnpm dev --port 3000'
    },
    assert: {
      assertions: {
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'interactive':           ['error', { maxNumericValue: 2000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'accessibility': ['error', { minScore: 1 }]
      }
    }
  }
};
