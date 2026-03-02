import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://mms-backend-service:8080/api/:path*", // Internal K8s service DNS + port
      },
    ];
  },
};

export default nextConfig;
