import { NextRequest, NextResponse } from "next/server";
import { isLocale, DEFAULT_LOCALE } from "@/lib/markets";

function localeForCountry(iso: string | null | undefined): string {
  const code = (iso ?? "").toUpperCase();
  if (code === "GB") return "uk";
  if (code === "AU") return "au";
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  if (isLocale(first)) {
    return NextResponse.next();
  }

  const locale = localeForCountry(request.headers.get("x-vercel-ip-country"));
  const rest = `/${segments.join("/")}`;
  const target = rest === "/" ? `/${locale}` : `/${locale}${rest}`;

  const url = request.nextUrl.clone();
  url.pathname = target;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|email-previews).*)"],
};
