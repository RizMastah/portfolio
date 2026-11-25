import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Short commit hash for the status bar; Vercel provides the full SHA at build time.
  env: { NEXT_PUBLIC_COMMIT: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local" },
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Inline the (small, Tailwind) CSS to remove the render-blocking request and speed up LCP.
    inlineCss: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [{ source: "/cv", destination: "/CV_Raihan_Aditito_Bagastama.pdf", permanent: false }];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm", {}]],
  },
});

export default withMDX(nextConfig);
