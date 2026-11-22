import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
  // Middleware configuration using proxy convention
  // This replaces the deprecated middleware file convention
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
};

export default nextConfig;
