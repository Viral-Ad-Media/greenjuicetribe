import { desc } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { posts } from "@/db/schema";

const fmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export default async function AdminHome() {
  const rows = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug, type: posts.type, status: posts.status, updatedAt: posts.updatedAt })
    .from(posts)
    .orderBy(desc(posts.updatedAt));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-black">Content</h1>
        <Link href="/admin/new/" className="rounded-full bg-leaf-600 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-700">+ New post</Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl ring-1 ring-leaf-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-leaf-50 text-xs uppercase tracking-wider text-ink/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-leaf-100">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-leaf-50/50">
                <td className="px-4 py-3">
                  <Link href={`/admin/edit/${r.id}/`} className="font-semibold text-ink hover:text-leaf-700">{r.title}</Link>
                  <div className="text-xs text-ink/50">/{r.slug}/</div>
                </td>
                <td className="px-4 py-3 capitalize">{r.type}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "published" ? "bg-leaf-100 text-leaf-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink/60">{fmt.format(r.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
