import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"], weight: ["700", "800", "900"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://greenjuicetribe.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Green Juice Tribe: Juicer & Blender Reviews, Green Juice Recipes",
    template: "%s | Green Juice Tribe",
  },
  description:
    "Honest juicer and blender buying guides, easy green juice recipes and smoothie tips from Green Juice Tribe.",
  openGraph: { siteName: "Green Juice Tribe", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
