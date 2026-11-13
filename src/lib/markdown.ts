import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "";

/**
 * Product links in articles are written as `[Check price](amazon:Product Name)`.
 * They become Amazon search links, with the affiliate tag appended when
 * NEXT_PUBLIC_AMAZON_TAG is set, so the tag lives in one place.
 */
export function amazonUrl(query: string) {
  const params = new URLSearchParams({ k: query });
  if (AMAZON_TAG) params.set("tag", AMAZON_TAG);
  return `https://www.amazon.com/s?${params.toString()}`;
}

function rewriteAmazonLinks(md: string) {
  return md.replace(/\]\(amazon:([^)]+)\)/g, (_, q: string) => `](${amazonUrl(q.trim())})`);
}

export function renderMarkdown(md: string): string {
  const raw = marked.parse(rewriteAmazonLinks(md), { async: false, gfm: true }) as string;
  return sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption"]),
    allowedAttributes: {
      a: ["href", "title", "rel", "target"],
      img: ["src", "alt", "title", "width", "height", "loading"],
      th: ["align"],
      td: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const external = /^https?:\/\//.test(attribs.href ?? "");
        return {
          tagName,
          attribs: external
            ? { ...attribs, target: "_blank", rel: "nofollow sponsored noopener" }
            : attribs,
        };
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
    },
  });
}

export function readingMinutes(md: string) {
  return Math.max(1, Math.round(md.split(/\s+/).length / 225));
}
