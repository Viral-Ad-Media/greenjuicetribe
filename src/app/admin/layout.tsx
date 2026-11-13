import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/sign-in/");

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-leaf-100 bg-leaf-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/admin/" className="font-display text-lg font-black">GJT Admin</Link>
            <Link href="/admin/" className="text-leaf-100 hover:text-white">Content</Link>
            <Link href="/admin/new/" className="text-leaf-100 hover:text-white">New</Link>
            <Link href="/" target="_blank" className="text-leaf-100 hover:text-white">View site ↗</Link>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-leaf-100 sm:inline">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</div>
    </div>
  );
}
