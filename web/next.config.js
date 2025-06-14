// web/next.config.js               ⬅️  replace the whole file
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/events/:path*",          // API proxy
        destination: "http://localhost:8000/events/:path*"
      }
    ];
  }
};

module.exports = nextConfig;
