import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Static export prerenders metadata at build time already; disabling
  // streaming metadata avoids the dev-only Suspense hydration warning
  // (Next.js 16 streams metadata by default on dynamically rendered pages).
  htmlLimitedBots: /.*/,
};

export default nextConfig;
