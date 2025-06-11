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

export default nextConfig;
