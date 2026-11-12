import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` emits a plain HTML/CSS/JS site to `out/`,
  // which can be hosted for free on Cloudflare Pages (no server required).
  output: "export",
  // Emit `/about/index.html` style folders so every static host resolves
  // clean URLs without extra rewrite rules.
  trailingSlash: true,
  // The default next/image optimizer needs a server; serve images as-is.
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
