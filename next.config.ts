// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Evita che la build fallisca per regole ESLint (il type-check rimane attivo)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Se vuoi forzare la build anche con errori TS, metti true (sconsigliato)
    ignoreBuildErrors: false,
  },
  // Se un giorno usi immagini remote:
  // images: { remotePatterns: [{ protocol: "https", hostname: "**" }] }
};

export default nextConfig;
