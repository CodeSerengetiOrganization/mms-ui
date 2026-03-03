import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const useK3sBackend = ["prod", "dev", "sit", "production"].includes(
      process.env.NODE_ENV ?? ""
    );
    const base =
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      (useK3sBackend
        ? "http://mms-backend-service:8080/api"
        : "http://localhost:8080/api");
    return [
      {
        source: "/api/:path*",
        destination: `${base}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
