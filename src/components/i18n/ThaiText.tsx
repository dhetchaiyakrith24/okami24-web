"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypography } from "@/lib/thai-typography";

/**
 * A Thai-only prose string (a page with no en/zh version, e.g. /about) rendered with the
 * render-time typography (src/lib/thai-typography.ts) — but only while the visitor reads Thai.
 * The prose is the same for every visitor; what this keeps is the rule the closing checker holds
 * the mechanism to (round 30.4ค, 2026-09-16): under the en/zh cookie no NBSP/WORD JOINER from
 * thai-typography.ts reaches the page. Same trick as <HomeText>: a fragment, no wrapper element,
 * the server still renders the Thai (DEFAULT_LOCALE) text.
 */
export function ThaiText({ children }: { children: string }) {
  const { locale } = useLocale();
  return <>{locale === "th" ? thaiTypography(children) : children}</>;
}
