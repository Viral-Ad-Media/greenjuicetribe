import Image from "next/image";
import Link from "next/link";
import { PostCard } from "@/components/post-card";
import { categoryHref, type PostWithCategories } from "@/lib/content";
import { readingMinutes, renderMarkdown } from "@/lib/markdown";

const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export function ArticleView({ post, related }: { post: PostWithCategories; related: PostWithCategories[] }) {
  const isPost = post.type === "post";
  const html = renderMarkdown(post.content);
  const date = post.updatedAt ?? post.publishedAt;
  const hasAffiliateLinks = post.content.includes("](amazon:");

  return (
    <article>
      <header className="bg-leaf-50">
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-12 text-center">
          {isPost && post.categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {post.categories.map((c) => (
                <Link key={c.id} href={categoryHref(c)} className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-leaf-700 ring-1 ring-leaf-200 hover:bg-leaf-100">
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          <h1 className="mt-4 font-display text-4xl font-black leading-tight text-ink sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/70">{post.excerpt}</p>}
          {isPost && (
            <p className="mt-5 text-sm text-ink/60">
              Updated {dateFmt.format(date)} · {readingMinutes(post.content)} min read
            </p>
          )}
        </div>
        {post.featuredImage && (
          <div className="mx-auto max-w-4xl px-4">
            <div className="relative mx-auto aspect-[16/8] translate-y-8 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-leaf-100">
              <Image src={post.featuredImage} alt={post.title} fill priority sizes="(min-width: 896px) 864px, 100vw" className="object-contain p-4" />
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-3xl px-4 pt-20">
        {hasAffiliateLinks && (
          <p className="mb-8 rounded-2xl bg-white p-4 text-sm text-ink/70 ring-1 ring-leaf-100">
            We may earn a commission when you buy through links on this page, at no extra cost to you.{" "}
            <Link href="/affiliate-disclosure/" className="font-semibold text-leaf-700 underline">Learn more</Link>.
          </p>
        )}
        <div className="article" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-20 max-w-6xl px-4">
          <h2 className="font-display text-2xl font-black">Keep reading</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
    </article>
  );
}
