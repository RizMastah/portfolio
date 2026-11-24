// Absolute site URL for metadata, sitemap and Open Graph.
// Set NEXT_PUBLIC_SITE_URL in Vercel once a custom domain exists; until then
// Vercel's production URL is used automatically.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
