import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://mms-backend-service:8080/api/v1/:path*", // Backend expects /api/v1/... (e.g. /api/v1/machines/status)
      },
    ];
  },
};

export default nextConfig;
