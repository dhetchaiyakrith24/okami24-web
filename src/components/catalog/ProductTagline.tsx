"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";

/**
 * The card's tagline in the visitor's language.
 *
 * Round 30.3 (docs/THAI_STYLE.md §6, item 1): the Thai storefront printed the English `tagline` on
 * every legacy card even though product-copy-th.ts already carried a human-checked Thai line for
 * the product — the product page (ProductHero) read that file, the card never did. Same shape as
 * PuffCount: the smallest client boundary that can see the locale, strings in, one string out, no
 * markup of its own, so the card's layout is exactly what it was. Thai shows the Thai line when
 * there is one and the English line otherwise (nothing goes blank); every other language keeps
 * the English line — there is no Chinese product copy.
 */
export function ProductTagline({ en, th }: { en: string; th?: string }) {
  const { locale } = useLocale();
  // Round 30.4ค closing: render-time Thai typography (thai-typography.ts) — the data string stays plain.
  return <>{locale === "th" && th ? thaiTypographyNode(th) : en}</>;
}
