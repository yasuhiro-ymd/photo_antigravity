import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/image',
      },
      {
        pathname: '/categories/**',
      },
    ],
  },
};

export default nextConfig;
