"use client";

import { useActionState, useState } from "react";
import type { Category, Post } from "@/db/schema";
import { savePost, type SaveState } from "./actions";

const input = "mt-1 w-full rounded-xl border border-leaf-200 bg-white px-3 py-2 outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200";

export function PostForm({ post, categories, selected }: { post?: Post; categories: Category[]; selected: number[] }) {
  const [state, action, pending] = useActionState<SaveState, FormData>(savePost, {});
  const [image, setImage] = useState(post?.featuredImage ?? "");

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_300px]">
      {post && <input type="hidden" name="id" value={post.id} />}
      <div className="space-y-5">
        <label className="block text-sm font-semibold">
          Title
          <input name="title" defaultValue={post?.title} required className={`${input} text-lg`} />
        </label>
        <label className="block text-sm font-semibold">
          Slug <span className="font-normal text-ink/50">(the URL: /slug/; leave blank to generate one from the title)</span>
          <input name="slug" defaultValue={post?.slug} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Excerpt
          <textarea name="excerpt" defaultValue={post?.excerpt} rows={2} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Content <span className="font-normal text-ink/50">(Markdown. Product buttons: <code>[Check price on Amazon](amazon:Product Name)</code>)</span>
          <textarea name="content" defaultValue={post?.content} rows={28} className={`${input} font-mono text-sm leading-relaxed`} />
        </label>
      </div>

      <aside className="space-y-5">
        <div className="rounded-2xl bg-leaf-50 p-4">
          <label className="block text-sm font-semibold">
            Status
            <select name="status" defaultValue={post?.status ?? "draft"} className={input}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Type
            <select name="type" defaultValue={post?.type ?? "post"} className={input}>
              <option value="post">Post (listed on the blog)</option>
              <option value="page">Page</option>
            </select>
          </label>
          <button disabled={pending} className="mt-4 w-full rounded-full bg-leaf-600 py-2.5 font-semibold text-white hover:bg-leaf-700 disabled:opacity-60">
            {pending ? "Saving…" : "Save"}
          </button>
          {state.error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{state.error}</p>}
          {state.ok && <p className="mt-3 rounded-lg bg-leaf-100 p-2 text-sm text-leaf-800">Saved.</p>}
          {post && post.status === "published" && (
            <a href={`/${post.slug}/`} target="_blank" className="mt-3 block text-center text-sm font-semibold text-leaf-700 hover:underline">View live ↗</a>
          )}
        </div>

        <fieldset className="rounded-2xl ring-1 ring-leaf-100 p-4">
          <legend className="px-1 text-sm font-semibold">Categories</legend>
          <div className="space-y-1.5">
            {categories.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="categories" value={c.id} defaultChecked={selected.includes(c.id)} className="accent-leaf-600" />
                {c.parentSlug ? "— " : ""}{c.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-2xl ring-1 ring-leaf-100 p-4">
          <label className="block text-sm font-semibold">
            Featured image path
            <input name="featuredImage" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/2026/09/photo.jpg" className={input} />
          </label>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="mt-3 max-h-40 w-full rounded-xl bg-leaf-50 object-contain p-2" />
          )}
        </div>

        <div className="rounded-2xl ring-1 ring-leaf-100 p-4 space-y-3">
          <p className="text-sm font-semibold">SEO <span className="font-normal text-ink/50">(optional)</span></p>
          <label className="block text-xs font-semibold">
            SEO title
            <input name="seoTitle" defaultValue={post?.seoTitle ?? ""} className={input} />
          </label>
          <label className="block text-xs font-semibold">
            Meta description
            <textarea name="seoDescription" defaultValue={post?.seoDescription ?? ""} rows={3} className={input} />
          </label>
        </div>
      </aside>
    </form>
  );
}
