const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};


// // web/next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,            // tiny perf win, default true but explicit here
//   experimental: {
//     typedRoutes: true,
//   },

//   /**
//    * For every /api/* request made by the browser, Next.js will forward it
//    * to the FastAPI backend. The target URL depends on where the code runs:
//    *
//    *  • Inside Docker Compose  →  http://backend:8000
//    *  • Local dev outside Docker →  http://localhost:8000
//    *  • Staging / Production    →  whatever you pass in NEXT_PUBLIC_API_URL
//    */
//   async rewrites() {
//     /** strip trailing slash if present */
//     const normalize = (url) => url.replace(/\/$/, "");

//     const dockerURL   = "http://backend:8000";
//     const localURL    = "http://localhost:8000";
//     const envOverride = process.env.NEXT_PUBLIC_API_URL
//       ? normalize(process.env.NEXT_PUBLIC_API_URL)
//       : null;

//     // When we run `next dev` directly, there is no Docker hostname `backend`
//     // — so default to localhost unless the env var is set.
//     const target =
//       process.env.NEXT_RUNNING_IN_DOCKER === "true"
//         ? envOverride || dockerURL
//         : envOverride || localURL;

//     return [
//       {
//         source: "/api/:path*",
//         destination: `${target}/:path*`,
//       },
//       // ── example of adding another proxy later ──
//       // {
//       //   source: "/grafana/:path*",
//       //   destination: `${target}/grafana/:path*`,
//       // },
//     ];
//   },
// };

// module.exports = nextConfig;
