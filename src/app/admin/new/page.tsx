import { getAllCategories } from "@/lib/content";
import { PostForm } from "../post-form";

export default async function NewPostPage() {
  const categories = await getAllCategories();
  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-black">New post</h1>
      <PostForm categories={categories} selected={[]} />
    </div>
  );
}
