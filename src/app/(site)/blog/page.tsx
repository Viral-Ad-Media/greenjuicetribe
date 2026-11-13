import type { Metadata } from "next";
import { PostGrid } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/content";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Every Green Juice Tribe guide, review and recipe.",
  alternates: { canonical: "/blog/" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl font-black sm:text-5xl">The Green Juice Tribe blog</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink/70">Juicer and blender guides, recipes and how-tos. {posts.length} articles and counting.</p>
      <div className="mt-10">
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
