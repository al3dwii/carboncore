module.exports = {
  output: 'standalone',
  webpack: config => {
    config.output.publicPath = 'auto';
    return config;
  },
  experimental: { esmExternals: false },
};
