/**
 * OKami24 — Phase 3.2: i18n foundation.
 *
 * Owner language policy: Thai (primary), English (secondary), Chinese (secondary). This file is
 * the single source of truth for which locales exist — everything else (dictionaries, the
 * switcher, detection) reads from here rather than repeating the list.
 */

export const LOCALES = ["th", "en", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

/** Used only when neither a saved choice nor a detected signal resolves to a supported locale. */
export const DEFAULT_LOCALE: Locale = "en";

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
