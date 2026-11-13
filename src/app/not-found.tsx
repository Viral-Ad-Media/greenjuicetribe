import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-7xl font-black text-leaf-500">404</p>
      <h1 className="mt-4 font-display text-3xl font-black">This page got juiced.</h1>
      <p className="mt-3 text-ink/70">We couldn&apos;t find what you were looking for.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-leaf-600 px-5 py-2.5 font-semibold text-white hover:bg-leaf-700">Home</Link>
        <Link href="/blog/" className="rounded-full bg-white px-5 py-2.5 font-semibold text-leaf-800 ring-1 ring-leaf-200 hover:bg-leaf-100">Browse articles</Link>
      </div>
    </main>
  );
}
