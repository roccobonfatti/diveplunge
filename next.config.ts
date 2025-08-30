// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Evita che la build fallisca per regole ESLint (il type-check rimane attivo)
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // images: { remotePatterns: [{ protocol: "https", hostname: "**" }] }
};

export default nextConfig;
