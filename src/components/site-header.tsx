import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/juicers/", label: "Juicers" },
  { href: "/blenders/", label: "Blenders" },
  { href: "/recipes/", label: "Recipes" },
  { href: "/buying-guides/", label: "Guides" },
  { href: "/blog/", label: "Blog" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-leaf-100 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="shrink-0" aria-label="Green Juice Tribe home">
          <Image src="/uploads/2022/10/Green-Juice-02.png" alt="Green Juice" width={160} height={55} priority className="h-10 w-auto" />
        </Link>
        <nav className="-mr-2 flex items-center gap-1 overflow-x-auto text-sm font-semibold">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-full px-3 py-2 text-ink/80 transition hover:bg-leaf-100 hover:text-leaf-800">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
