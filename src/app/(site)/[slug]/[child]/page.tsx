import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/category-view";
import { getCategory, getPostsInCategory } from "@/lib/content";

export const revalidate = 300;

// Render each URL on first visit, then cache it (ISR). Admin saves revalidate immediately.
export async function generateStaticParams() {
  return [];
}

// Child categories, e.g. /blenders/single-serve-blenders/
export async function generateMetadata({ params }: PageProps<"/[slug]/[child]">): Promise<Metadata> {
  const { slug, child } = await params;
  const c = await getCategory(child, slug);
  if (!c) return {};
  return { title: c.name, description: c.description, alternates: { canonical: `/${slug}/${child}/` } };
}

export default async function ChildCategoryPage({ params }: PageProps<"/[slug]/[child]">) {
  const { slug, child } = await params;
  const [category, parent] = await Promise.all([getCategory(child, slug), getCategory(slug, null)]);
  if (!category) notFound();
  return <CategoryView category={category} parent={parent} posts={await getPostsInCategory(category.id)} />;
}
