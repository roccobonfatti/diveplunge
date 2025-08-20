// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👉 Disattiva ESLint durante la build di produzione (Vercel)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
