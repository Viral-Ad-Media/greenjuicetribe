import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-leaf-900 text-leaf-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-extrabold">Green Juice Tribe</p>
          <p className="mt-3 text-sm leading-relaxed text-leaf-100/80">
            Juicer and blender guides, green juice recipes and smoothie tips for people who want to drink more plants.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-leaf-300">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/juicers/" className="hover:text-white">Juicers</Link></li>
            <li><Link href="/blenders/" className="hover:text-white">Blenders</Link></li>
            <li><Link href="/green-juice-recipe/" className="hover:text-white">Green juice recipes</Link></li>
            <li><Link href="/comparisons/" className="hover:text-white">Comparisons</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-leaf-300">About</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about/" className="hover:text-white">About us</Link></li>
            <li><Link href="/affiliate-disclosure/" className="hover:text-white">Affiliate disclosure</Link></li>
            <li><Link href="/privacy-policy/" className="hover:text-white">Privacy policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-leaf-100/70">
          © {new Date().getFullYear()} Green Juice Tribe. As an Amazon Associate we may earn from qualifying purchases.
          Content is for general information and isn&apos;t medical advice.
        </p>
      </div>
    </footer>
  );
}
