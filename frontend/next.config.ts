import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Rust-based SWC minifier for faster builds
    swcPlugins: [],
  },
  transpilePackages: [
    'better-auth'
  ],
};

export default nextConfig;
