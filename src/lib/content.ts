import "server-only";
import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { categories, postCategories, posts, type Category, type Post } from "@/db/schema";

export type PostWithCategories = Post & { categories: Category[] };

async function attachCategories(rows: Post[]): Promise<PostWithCategories[]> {
  if (rows.length === 0) return [];
  const links = await db
    .select({ postId: postCategories.postId, category: categories })
    .from(postCategories)
    .innerJoin(categories, eq(postCategories.categoryId, categories.id))
    .where(inArray(postCategories.postId, rows.map((r) => r.id)))
    .orderBy(asc(categories.sortOrder));
  return rows.map((p) => ({
    ...p,
    categories: links.filter((l) => l.postId === p.id).map((l) => l.category),
  }));
}

export async function getPublishedPosts(limit?: number) {
  const q = db
    .select()
    .from(posts)
    .where(and(eq(posts.type, "post"), eq(posts.status, "published")))
    .orderBy(desc(posts.publishedAt));
  const rows = limit ? await q.limit(limit) : await q;
  return attachCategories(rows);
}

export async function getPublishedBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);
  if (!row) return null;
  const [withCats] = await attachCategories([row]);
  return withCats;
}

export async function getCategory(slug: string, parentSlug: string | null = null) {
  const [row] = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (!row || (row.parentSlug ?? null) !== parentSlug) return null;
  return row;
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getPostsInCategory(categoryId: number) {
  const rows = await db
    .select({ post: posts })
    .from(posts)
    .innerJoin(postCategories, eq(postCategories.postId, posts.id))
    .where(
      and(
        eq(postCategories.categoryId, categoryId),
        eq(posts.status, "published"),
        eq(posts.type, "post"),
      ),
    )
    .orderBy(desc(posts.publishedAt));
  return attachCategories(rows.map((r) => r.post));
}

export async function getRelatedPosts(post: PostWithCategories, limit = 3) {
  const catId = post.categories[0]?.id;
  if (!catId) return [];
  const inCat = await getPostsInCategory(catId);
  return inCat.filter((p) => p.id !== post.id).slice(0, limit);
}

export function categoryHref(c: Pick<Category, "slug" | "parentSlug">) {
  return c.parentSlug ? `/${c.parentSlug}/${c.slug}/` : `/${c.slug}/`;
}
