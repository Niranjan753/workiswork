import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "berlified.xyz",
      },
      {
        protocol: "https",
        hostname: "pocketsflow.com",
      },
    ],
  },
};

export default nextConfig;
