/**
 * OKami24 — Phase 3.2: i18n foundation.
 *
 * Owner language policy: Thai (primary), English (secondary), Chinese (secondary). This file is
 * the single source of truth for which locales exist — everything else (dictionaries, the
 * switcher) reads from here rather than repeating the list.
 *
 * Owner decision, 2026-09-06 (docs/BUSINESS_SOURCE_OF_TRUTH.md §20): Thai is what EVERY visitor
 * gets on a first visit — every person, every country, every page. The site does not guess from
 * the visitor's country or browser language any more; the country-header/Accept-Language
 * detection that used to live in `src/proxy.ts` + `src/i18n/detect-locale.ts` was deleted rather
 * than re-pointed at a new host's header, because the guess had no upside for a Thai shop and
 * every guess is a way to be wrong. Foreign visitors switch with the language button, and that
 * choice is remembered in the `okami24_locale` cookie for a year.
 */

export const LOCALES = ["th", "en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** What every visitor gets until they choose otherwise — see the owner decision above. This is
 *  also what the server renders into the static HTML, so search engines read the site in Thai. */
export const DEFAULT_LOCALE: Locale = "th";

/** Plain, non-httpOnly — this is a display preference, not a security-sensitive value, and the
 *  language switcher (a client component) needs to read/write it directly. */
export const LOCALE_COOKIE = "okami24_locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  th: "ไทย",
  en: "English",
  zh: "中文",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
