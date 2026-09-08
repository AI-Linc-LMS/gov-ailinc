import type { NextConfig } from "next";
import path from "node:path";

/**
 * Force browser build: package "node" export pulls jspdf.node.min.js → fflate Worker
 * which Turbopack cannot bundle ("Can't resolve <dynamic>").
 * Use a posix-relative path for turbopack (absolute Windows paths are rejected).
 */
const jspdfEsRelative = "./node_modules/jspdf/dist/jspdf.es.min.js";
const jspdfEsAbsolute = path.join(
  process.cwd(),
  "node_modules/jspdf/dist/jspdf.es.min.js"
);

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      jspdf: jspdfEsAbsolute,
    };
    return config;
  },

  turbopack: {
    resolveAlias: {
      jspdf: jspdfEsRelative,
    },
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  output: "standalone",
  
  experimental: {
    optimizePackageImports: ["@mui/material", "@mui/icons-material"],
    // Reuse the client Router Cache for visited routes so back/again navigation
    // is instant instead of refetching the route on every visit. Default for
    // dynamic routes is 0 (never reused); 30s makes revisits snappy without
    // going stale. (Next.js experimental.staleTimes.)
    // DEMO REPO ONLY: hold visited routes in the client Router Cache for the
    // whole session. Upstream uses 30s because server data can change; here the
    // data is generated in this browser and cannot, so re-fetching a route the
    // visitor has already seen is pure latency. A revisit becomes an instant
    // cache read with no network, no RSC round trip and nothing to re-render.
    staleTimes: {
      dynamic: 3600,
      static: 3600,
    },
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  
  reactStrictMode: true,
};

export default nextConfig;
