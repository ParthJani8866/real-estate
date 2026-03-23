import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Backward-compat: old property detail links used /property/<mongodbObjectId>
        source: "/property/:id([0-9a-fA-F]{24})",
        destination: "/property/id/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
