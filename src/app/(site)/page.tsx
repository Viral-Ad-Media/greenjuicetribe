import Image from "next/image";
import Link from "next/link";
import { PostGrid } from "@/components/post-card";
import { getPublishedPosts } from "@/lib/content";

export const revalidate = 300;

const TOPICS = [
  {
    href: "/juicers/",
    title: "Juicers",
    blurb: "Masticating, centrifugal, twin gear and press juicers, compared.",
    image: "/uploads/2022/10/Hurom-HAA-slow-juicer.jpg",
  },
  {
    href: "/blenders/",
    title: "Blenders",
    blurb: "Countertop, commercial, portable and single-serve picks.",
    image: "/uploads/2022/10/1.-Vitamix-Professional-Series-750.jpg",
  },
  {
    href: "/recipes/",
    title: "Recipes",
    blurb: "Green juices and smoothies that actually taste good.",
    image: "/uploads/2022/09/green-kale-smoothie.jpg",
  },
];

export default async function HomePage() {
  const latest = await getPublishedPosts(6);

  return (
    <>
      <section className="relative overflow-hidden bg-leaf-50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-leaf-700 ring-1 ring-leaf-200">
              Drink more plants
            </p>
            <h1 className="mt-5 font-display text-4xl font-black leading-[1.05] text-ink sm:text-5xl lg:text-6xl">
              Find the right juicer. <span className="text-leaf-600">Make the perfect green juice.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink/75">
              Honest buying guides for juicers and blenders, plus simple green juice and smoothie recipes for every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/best-masticating-juicers-2026/" className="rounded-full bg-leaf-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-leaf-700">
                Best juicers of 2026
              </Link>
              <Link href="/green-juice-recipe-for-beginners/" className="rounded-full bg-white px-6 py-3 font-semibold text-leaf-800 ring-1 ring-leaf-200 transition hover:bg-leaf-100">
                Beginner green juice
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-leaf-200" />
            <Image
              src="/uploads/2022/09/young-woman-working-at-a-juice-bar-PR4JUKR.jpg"
              alt="Fresh juice being prepared at a juice bar"
              fill
              priority
              sizes="(min-width: 768px) 448px, 90vw"
              className="rounded-[2rem] object-cover shadow-lg"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {TOPICS.map((t) => (
            <Link key={t.href} href={t.href} className="group flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-leaf-100 transition hover:shadow-md">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-leaf-50">
                <Image src={t.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
              </div>
              <div>
                <h2 className="font-display text-xl font-extrabold group-hover:text-leaf-700">{t.title}</h2>
                <p className="mt-1 text-sm text-ink/70">{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-black">Latest guides</h2>
          <Link href="/blog/" className="text-sm font-semibold text-leaf-700 hover:underline">All articles →</Link>
        </div>
        <div className="mt-8">
          <PostGrid posts={latest} />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-leaf-700 p-8 text-white md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <h2 className="font-display text-3xl font-black">Juicer or blender?</h2>
            <p className="mt-3 max-w-xl text-leaf-50/90">
              Juice skips the fiber; smoothies keep it. Here&apos;s how they compare on nutrition, fullness, cost and cleanup.
            </p>
          </div>
          <Link href="/juicing-vs-blending-2026/" className="justify-self-start rounded-full bg-citrus px-6 py-3 font-semibold text-ink transition hover:brightness-95">
            Read the comparison
          </Link>
        </div>
      </section>
    </>
  );
}
