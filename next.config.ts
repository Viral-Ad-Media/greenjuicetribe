import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WordPress used trailing slashes; keep the same URLs so existing links and rankings carry over.
  // Links render with a trailing slash. The redirect itself happens in src/proxy.ts so it can skip /api
  // (Better Auth's endpoints don't use trailing slashes).
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // URLs the attacker created on the old site. Send any visitors or links to the real articles.
      { source: "/best-centrifugal-juicers-2026/", destination: "/best-centrifugal-juicers-2023/", permanent: true },
      { source: "/2022/10/07/best-centrifugal-juicers-2026/", destination: "/best-centrifugal-juicers-2023/", permanent: true },
      { source: "/2026/04/22/how-to-store-smoothies-overnight/", destination: "/how-to-store-smoothies-overnight/", permanent: true },
      { source: "/2026/05/06/how-to-clean-juicer/", destination: "/how-to-clean-juicer/", permanent: true },
      // Old WordPress paths
      { source: "/category/:slug/", destination: "/:slug/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/admin/", permanent: false },
      { source: "/wp-login.php", destination: "/sign-in/", permanent: false },
      { source: "/feed/", destination: "/blog/", permanent: false },
    ];
  },
};

export default nextConfig;
