import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { postCategories, posts } from "@/db/schema";
import { getAllCategories } from "@/lib/content";
import { deletePost } from "../../actions";
import { PostForm } from "../../post-form";

export default async function EditPostPage({ params }: PageProps<"/admin/edit/[id]">) {
  const id = Number((await params).id);
  if (!id) notFound();
  const [[post], categories, links] = await Promise.all([
    db.select().from(posts).where(eq(posts.id, id)).limit(1),
    getAllCategories(),
    db.select({ categoryId: postCategories.categoryId }).from(postCategories).where(eq(postCategories.postId, id)),
  ]);
  if (!post) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-black">Edit {post.type}</h1>
        <form action={deletePost}>
          <input type="hidden" name="id" value={post.id} />
          <button className="rounded-full px-3 py-1.5 text-sm font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-50">Delete</button>
        </form>
      </div>
      <PostForm post={post} categories={categories} selected={links.map((l) => l.categoryId)} />
    </div>
  );
}
