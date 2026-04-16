/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  webpack: (config) => {
    // 1. Fallbacks for node environment mismatches
    config.resolve.fallback = {
      ...config.resolve.fallback,
      encoding: false,
      'pino-pretty': false,
      lokijs: false,
    };

    // 2. 🔥 BLOCKING PROBLEM MODULES
    // This stops Webpack from trying to resolve the missing libraries
    config.resolve.alias = {
      ...config.resolve.alias,
      '@metamask/sdk': false,
      '@coinbase/wallet-sdk': false,
      'porto': false,
      'porto/internal': false, // Specifically kill the porto error
    };

    return config;
  },
};

module.exports = nextConfig;