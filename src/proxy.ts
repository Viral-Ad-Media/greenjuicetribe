import { NextResponse, type NextRequest } from "next/server";

/** Adds the trailing slash WordPress used (/juicers -> /juicers/) everywhere except API routes and files. */
export function proxy(request: NextRequest) {
  // Use the raw URL: nextUrl normalizes trailing slashes when trailingSlash is enabled.
  const url = new URL(request.url);
  if (!url.pathname.endsWith("/") && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    url.pathname = `${url.pathname}/`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|uploads/).*)"],
};
