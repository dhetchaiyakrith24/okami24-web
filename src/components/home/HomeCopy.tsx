"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { FLAVOR_COPY_TH, FLAVOR_COPY_ZH } from "@/i18n/flavor-copy";

/**
 * Round 30.3ข (owner, 2026-09-11) — the homepage sections are Server Components whose headings,
 * ledes and CTAs were English string props. These three tiny client components are the same trick
 * as <PuffCount> / <ProductTagline>: the server keeps rendering the section, only the text node
 * reads the visitor's language. They render a fragment — no wrapper element — so the DOM around
 * them is unchanged and the desktop layout does not move.
 */

/** One string from `dict.home` (see dictionaries/types.ts). `n` fills a `{n}` placeholder. */
export function HomeText({ k, n }: { k: keyof Dictionary["home"]; n?: number }) {
  const { dict } = useLocale();
  const text = dict.home[k];
  return <>{n === undefined ? text : text.replace("{n}", String(n))}</>;
}

/** A guide's title or dek in the visitor's language — the same overlay GuideDetailPageHeader uses
 *  on the guide's own page, so the teaser card and the page it opens read the same words. */
export function GuideText({ id, field, en }: { id: string; field: "title" | "dek"; en: string }) {
  const { locale } = useLocale();
  const overlay = locale === "th" ? GUIDES_COPY_TH[id] : locale === "zh" ? GUIDES_COPY_ZH[id] : undefined;
  return <>{overlay?.[field] ?? en}</>;
}

/** A flavor family's name or first character note — the overlay ELiquidFamilyPageHeader uses. */
export function FlavorText({ id, field, en }: { id: string; field: "name" | "firstNote"; en: string }) {
  const { locale } = useLocale();
  const overlay = locale === "th" ? FLAVOR_COPY_TH[id] : locale === "zh" ? FLAVOR_COPY_ZH[id] : undefined;
  if (!overlay) return <>{en}</>;
  return <>{field === "name" ? overlay.name : (overlay.characterNotes[0] ?? en)}</>;
}
