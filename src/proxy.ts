import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/i18n/config";
import { detectLocale } from "@/i18n/detect-locale";

/**
 * OKami24 — Phase 3.2: first-visit locale detection.
 *
 * Named `proxy.ts` per this Next.js version's file convention (the `middleware.ts` convention it
 * replaces is deprecated — see node_modules/next/dist/docs/01-app/03-api-reference/
 * 03-file-conventions/proxy.md, surfaced by a build-time deprecation warning during development).
 *
 * Sets `okami24_locale` exactly once, only when it doesn't already exist. This is the entire
 * mechanism behind "manual choice overrides automatic detection": the language switcher writes
 * this same cookie client-side (see LocaleProvider.tsx), and once it exists — from either source
 * — this proxy never touches it again for that browser. No user preference is ever silently
 * replaced by a fresh geo/Accept-Language guess.
 *
 * Does not read/write anything else and does not rewrite the request path — every route keeps
 * its current URL (see the Phase 3.2 report §LOCALE ROUTING STRATEGY for why a full `/th /en /zh`
 * prefix migration was deferred rather than attempted in this phase).
 */
export function proxy(request: NextRequest) {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(existing)) return NextResponse.next();

  // `x-vercel-ip-country` is set by Vercel's edge network when deployed there; it is simply
  // absent in local dev and on other hosts, which is the documented deterministic fallback path
  // (Accept-Language, then DEFAULT_LOCALE) — see detect-locale.ts. No third-party geo-IP service.
  const country = request.headers.get("x-vercel-ip-country");
  const acceptLanguage = request.headers.get("accept-language");
  const locale = detectLocale({ country, acceptLanguage });

  const response = NextResponse.next();
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
