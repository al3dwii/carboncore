const { withFederatedSidecar } = require('@module-federation/nextjs-mf');
const { remotes } = require('./src/remotes.map');     // auto-generated
module.exports = withFederatedSidecar({ name: 'console', remotes })({});
