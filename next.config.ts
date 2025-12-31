import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oxisverse.com",
      },
    ],
  },
};

export default nextConfig;
