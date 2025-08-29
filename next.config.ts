import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.stylitics.com",
      },
    ],
  },
};

export default nextConfig;
