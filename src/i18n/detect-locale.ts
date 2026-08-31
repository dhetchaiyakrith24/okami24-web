import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/**
 * First-visit locale detection — owner policy: Thailand → th, China → zh, everyone else → en.
 *
 * `country` should come from a platform-provided geo signal (e.g. Vercel's `x-vercel-ip-country`
 * request header — see middleware.ts). It is deliberately NOT fetched from a third-party geo-IP
 * service; when the deployment platform doesn't provide one (any local/dev run, and some hosts),
 * `country` is `null` and this falls back to the request's `Accept-Language` header, then to
 * `DEFAULT_LOCALE`. This fallback is deterministic and documented here rather than silently
 * guessing: local dev always resolves to `en` unless the browser's own Accept-Language happens to
 * start with `th`/`zh`.
 */
export function detectLocale({ country, acceptLanguage }: { country?: string | null; acceptLanguage?: string | null }): Locale {
  const normalizedCountry = country?.toUpperCase();
  if (normalizedCountry === "TH") return "th";
  if (normalizedCountry === "CN") return "zh";

  const primarySubtag = acceptLanguage
    ?.split(",")[0]
    ?.split("-")[0]
    ?.trim()
    .toLowerCase();
  if (isLocale(primarySubtag)) return primarySubtag;

  return DEFAULT_LOCALE;
}
