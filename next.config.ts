import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: process.cwd()
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ucarecdn.com" },
      { protocol: "https", hostname: "**.ucarecdn.com" },
      { protocol: "https", hostname: "**.ucarecd.net" },
      { protocol: "https", hostname: "www.hotplate.com" },
      { protocol: "https", hostname: "hotplate.com" }
    ]
  }
};

export default nextConfig;
