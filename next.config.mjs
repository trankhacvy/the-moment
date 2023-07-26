import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins([[withBundleAnalyzer({ enabled: false })]], {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["google.com", "gsohmicqdlihspbntfet.supabase.co", "res.cloudinary.com"],
  },
  // experimental: { instrumentationHook: true },
  // rewrites() {
  //   return [
  //     { source: "/healthz", destination: "/api/health" },
  //     { source: "/api/healthz", destination: "/api/health" },
  //     { source: "/health", destination: "/api/health" },
  //     { source: "/ping", destination: "/api/health" },
  //   ]
  // },
})

export default config
