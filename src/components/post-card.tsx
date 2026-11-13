import Image from "next/image";
import Link from "next/link";
import type { PostWithCategories } from "@/lib/content";

export function PostCard({ post, priority = false }: { post: PostWithCategories; priority?: boolean }) {
  const cat = post.categories[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-leaf-100 transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/${post.slug}/`} className="relative block aspect-[16/10] overflow-hidden bg-leaf-50">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {cat && <p className="text-xs font-bold uppercase tracking-wider text-leaf-600">{cat.name}</p>}
        <h3 className="mt-2 font-display text-xl font-extrabold leading-snug text-ink">
          <Link href={`/${post.slug}/`} className="hover:text-leaf-700">{post.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: PostWithCategories[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <PostCard key={p.id} post={p} priority={i < 3} />
      ))}
    </div>
  );
}
