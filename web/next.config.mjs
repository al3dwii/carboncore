import { withModuleFederation } from "@module-federation/nextjs-mf";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/events/:path*',
        destination: 'http://localhost:8000/events/:path*',
      },
    ];
  },
};

export default withModuleFederation({
  name: "web",
  filename: "static/runtime/remoteEntry.js",
  remotes: {},
  exposes: { "./registry": "./src/registry" },
  shared: {}
})(nextConfig);
