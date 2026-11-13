import type { MetadataRoute } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { categoryHref, getAllCategories } from "@/lib/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://greenjuicetribe.com").replace(/\/$/, "");
  const [rows, cats] = await Promise.all([
    db.select({ slug: posts.slug, updatedAt: posts.updatedAt, featuredImage: posts.featuredImage }).from(posts).where(and(eq(posts.status, "published"))),
    getAllCategories(),
  ]);
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog/`, changeFrequency: "weekly", priority: 0.8 },
    ...cats.map((c) => ({ url: `${base}${categoryHref(c)}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...rows.map((p) => ({
      url: `${base}/${p.slug}/`,
      lastModified: p.updatedAt,
      images: p.featuredImage ? [`${base}${p.featuredImage}`] : undefined,
    })),
  ];
}
