import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://greenjuicetribe.com").replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/sign-in/", "/api/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
