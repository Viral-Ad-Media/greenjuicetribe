"use server";

import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { postCategories, posts } from "@/db/schema";
import { getAdminSession } from "@/lib/auth";

async function requireAdmin() {
  if (!(await getAdminSession())) throw new Error("Not authorized");
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const RESERVED = new Set(["admin", "api", "blog", "sign-in", "sitemap.xml", "robots.txt", "uploads", "_next"]);

export type SaveState = { error?: string; ok?: boolean };

export async function savePost(_prev: SaveState, form: FormData): Promise<SaveState> {
  await requireAdmin();

  const id = Number(form.get("id")) || null;
  const title = String(form.get("title") ?? "").trim();
  const slug = slugify(String(form.get("slug") ?? "") || title);
  if (!title) return { error: "Title is required." };
  if (!slug || RESERVED.has(slug)) return { error: "Please choose a different slug." };

  const status = form.get("status") === "published" ? "published" : "draft";
  const values = {
    title,
    slug,
    type: form.get("type") === "page" ? ("page" as const) : ("post" as const),
    status: status as "draft" | "published",
    excerpt: String(form.get("excerpt") ?? ""),
    content: String(form.get("content") ?? ""),
    featuredImage: String(form.get("featuredImage") ?? "").trim() || null,
    seoTitle: String(form.get("seoTitle") ?? "").trim() || null,
    seoDescription: String(form.get("seoDescription") ?? "").trim() || null,
    updatedAt: new Date(),
  };
  const categoryIds = form.getAll("categories").map(Number).filter(Boolean);

  const [clash] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
  if (clash && clash.id !== id) return { error: `Another item already uses the slug "${slug}".` };

  let postId: number;
  if (id) {
    const [current] = await db.select({ publishedAt: posts.publishedAt, slug: posts.slug }).from(posts).where(eq(posts.id, id)).limit(1);
    if (!current) return { error: "That item no longer exists." };
    await db
      .update(posts)
      .set({ ...values, publishedAt: current.publishedAt ?? (status === "published" ? new Date() : null) })
      .where(eq(posts.id, id));
    postId = id;
    if (current.slug !== slug) revalidatePath(`/${current.slug}/`);
  } else {
    [{ id: postId }] = await db
      .insert(posts)
      .values({ ...values, publishedAt: status === "published" ? new Date() : null })
      .returning({ id: posts.id });
  }

  await db.delete(postCategories).where(inArray(postCategories.postId, [postId]));
  if (categoryIds.length) {
    await db.insert(postCategories).values(categoryIds.map((categoryId) => ({ postId, categoryId })));
  }

  revalidatePath("/", "layout");
  if (!id) redirect(`/admin/edit/${postId}/`);
  return { ok: true };
}

export async function deletePost(form: FormData) {
  await requireAdmin();
  const id = Number(form.get("id"));
  if (id) await db.delete(posts).where(eq(posts.id, id));
  revalidatePath("/", "layout");
  redirect("/admin/");
}
