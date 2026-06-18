import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "pizza-craft.t3.storageapi.dev",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
