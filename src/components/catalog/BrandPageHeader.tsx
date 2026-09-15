"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypography } from "@/lib/thai-typography";
import type { Brand } from "@/types/catalog";
import type { ReactNode } from "react";

/**
 * Structural i18n fix (owner quality review, 2026-09-02) — found by the strengthened
 * i18n-contract-test.ts check ("no Server Component page.tsx calls <PageHeader> directly").
 * `brand.tagline`/`.name` are real brand-specific editorial copy (like `category.name` in
 * CategoryPageHeader.tsx), not generic UI chrome, so they stay untranslated. It exists so
 * `brands/[brand]/page.tsx` can stay a plain Server Component while matching the same
 * "PageHeader always goes through a `\"use client\"` wrapper" shape as every other page.
 *
 * Round 30.3ข (owner, 2026-09-11): the lede under the H1 reads `brand.descriptionTh` for a Thai
 * visitor (the same string the crawler gets as the meta description); the brand name (H1) stays
 * English — THAI_STYLE layer 1.
 * Round 30.4 wiring D (owner, 2026-09-12): the eyebrow reads `brand.taglineTh` for a Thai visitor
 * where one exists (the four brands whose tagline is a plain description); a brand whose tagline
 * is a slogan has no `taglineTh` and keeps the English line in every language.
 */
export function BrandPageHeader({ brand, meta }: { brand: Brand; meta?: ReactNode }) {
  const { locale } = useLocale();
  const description = locale === "th" ? thaiTypography(brand.descriptionTh ?? brand.description) : brand.description;
  const eyebrow = locale === "th" ? (brand.taglineTh ?? brand.tagline) : brand.tagline;
  return <PageHeader eyebrow={eyebrow} title={brand.name} description={description} meta={meta} />;
}
