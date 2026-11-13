import Link from "next/link";
import { PostGrid } from "@/components/post-card";
import type { Category } from "@/db/schema";
import type { PostWithCategories } from "@/lib/content";

export function CategoryView({ category, posts, parent }: { category: Category; posts: PostWithCategories[]; parent?: Category | null }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      {parent && (
        <Link href={`/${parent.slug}/`} className="text-sm font-semibold text-leaf-700 hover:underline">
          ← {parent.name}
        </Link>
      )}
      <h1 className="mt-2 font-display text-4xl font-black sm:text-5xl">{category.name}</h1>
      {category.description && <p className="mt-3 max-w-2xl text-lg text-ink/70">{category.description}</p>}
      <div className="mt-10">
        {posts.length ? <PostGrid posts={posts} /> : <p className="text-ink/60">No articles here yet.</p>}
      </div>
    </div>
  );
}
