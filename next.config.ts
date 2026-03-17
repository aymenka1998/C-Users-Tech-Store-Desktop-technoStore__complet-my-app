import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ هذا السطر هو الأهم لحل مشكلة ظهور الصور من localhost
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
  // تحسين أداء الترجمة (اختياري)
  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;