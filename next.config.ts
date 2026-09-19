import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
      { source: '/ingest/decide', destination: 'https://eu.i.posthog.com/decide' },
    ];
  },
};

export default nextConfig;
