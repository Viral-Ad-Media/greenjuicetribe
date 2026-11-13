/**
 * Loads the articles in content/ into the database.
 *
 *   npm run db:seed            # insert anything missing, leave existing rows alone
 *   npm run db:seed -- --force # overwrite existing rows with the files in content/
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { eq, inArray } from "drizzle-orm";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

const { categories, postCategories, posts } = schema;

const CATEGORIES = [
  { slug: "juicers", name: "Juicers", description: "Reviews and buying guides for masticating, centrifugal, twin gear, hydraulic and manual juicers.", parentSlug: null, sortOrder: 1 },
  { slug: "blenders", name: "Blenders", description: "Countertop, commercial, portable and single-serve blenders for smoothies and more.", parentSlug: null, sortOrder: 2 },
  { slug: "single-serve-blenders", name: "Single-Serve Blenders", description: "Blend-and-go blenders for one-person smoothies.", parentSlug: "blenders", sortOrder: 3 },
  { slug: "personal-blenders", name: "Personal Blenders", description: "Compact and portable blenders for smoothies on the go.", parentSlug: null, sortOrder: 4 },
  { slug: "recipes", name: "Recipes", description: "Green juices, smoothies and simple plant-based recipes.", parentSlug: null, sortOrder: 5 },
  { slug: "buying-guides", name: "Buying Guides", description: "How to choose, use and care for your juicing and blending gear.", parentSlug: null, sortOrder: 6 },
  { slug: "comparisons", name: "Comparisons", description: "Head-to-head comparisons to help you pick the right tool.", parentSlug: null, sortOrder: 7 },
];

type Front = Record<string, string>;

function parseFile(path: string): { front: Front; body: string } {
  const raw = readFileSync(path, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Missing frontmatter in ${path}`);
  const front: Front = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    let v = line.slice(i + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    front[line.slice(0, i).trim()] = v;
  }
  return { front, body: m[2].trim() + "\n" };
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const force = process.argv.includes("--force");
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  const pool = isLocal ? new Pool({ connectionString: url }) : null;
  const db = (pool ? drizzlePg(pool, { schema }) : drizzleNeon(neon(url), { schema })) as NeonHttpDatabase<typeof schema>;

  for (const c of CATEGORIES) {
    await db
      .insert(categories)
      .values(c)
      .onConflictDoUpdate({ target: categories.slug, set: { name: c.name, description: c.description, parentSlug: c.parentSlug, sortOrder: c.sortOrder } });
  }
  const catRows = await db.select().from(categories);
  const catId = new Map(catRows.map((c) => [c.slug, c.id]));

  let inserted = 0, updated = 0, skipped = 0;
  for (const [dir, type] of [["content/posts", "post"], ["content/pages", "page"]] as const) {
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
      const slug = file.replace(/\.md$/, "");
      const { front, body } = parseFile(join(dir, file));
      const values = {
        slug,
        type,
        status: "published" as const,
        title: front.title,
        excerpt: front.excerpt ?? "",
        content: body,
        featuredImage: front.image || null,
        seoDescription: front.excerpt ?? null,
        publishedAt: new Date(`${front.date}T12:00:00Z`),
        updatedAt: new Date(),
      };

      const [existing] = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).limit(1);
      let id: number;
      if (existing && !force) {
        skipped++;
        continue;
      } else if (existing) {
        await db.update(posts).set(values).where(eq(posts.id, existing.id));
        id = existing.id;
        updated++;
      } else {
        [{ id }] = await db.insert(posts).values(values).returning({ id: posts.id });
        inserted++;
      }

      const cats = (front.categories ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      const ids = cats.map((s) => {
        const cid = catId.get(s);
        if (!cid) throw new Error(`${file}: unknown category "${s}"`);
        return cid;
      });
      await db.delete(postCategories).where(inArray(postCategories.postId, [id]));
      if (ids.length) await db.insert(postCategories).values(ids.map((categoryId) => ({ postId: id, categoryId })));
    }
  }

  console.log(`Seed done: ${inserted} inserted, ${updated} updated, ${skipped} already present (use --force to overwrite).`);
  await pool?.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
