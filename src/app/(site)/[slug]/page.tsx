import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/article-view";
import { CategoryView } from "@/components/category-view";
import { getCategory, getPostsInCategory, getPublishedBySlug, getRelatedPosts } from "@/lib/content";

export const revalidate = 300;

// Render each URL on first visit, then cache it (ISR). Admin saves revalidate immediately.
export async function generateStaticParams() {
  return [];
}

// Like WordPress with "no category base", /<slug>/ can be a post, a page or a top-level category.
async function resolve(slug: string) {
  const post = await getPublishedBySlug(slug);
  if (post) return { kind: "post" as const, post };
  const category = await getCategory(slug, null);
  if (category) return { kind: "category" as const, category };
  return null;
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) return {};
  if (r.kind === "category") {
    return { title: r.category.name, description: r.category.description, alternates: { canonical: `/${slug}/` } };
  }
  const p = r.post;
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt,
    alternates: { canonical: `/${slug}/` },
    openGraph: {
      type: p.type === "post" ? "article" : "website",
      title: p.title,
      description: p.excerpt,
      images: p.featuredImage ? [p.featuredImage] : undefined,
    },
  };
}

export default async function SlugPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const r = await resolve(slug);
  if (!r) notFound();
  if (r.kind === "category") {
    return <CategoryView category={r.category} posts={await getPostsInCategory(r.category.id)} />;
  }
  const related = r.post.type === "post" ? await getRelatedPosts(r.post) : [];
  return <ArticleView post={r.post} related={related} />;
}
