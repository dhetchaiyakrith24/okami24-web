"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypography } from "@/lib/thai-typography";
import { CategoryLabel } from "@/components/catalog/CategoryLabel";
import type { Category } from "@/types/catalog";

/**
 * Split out of products/[slug]/page.tsx (same reason as SearchPageHeader.tsx) so the page can
 * stay a plain Server Component. Phase 3.2.2 kept `category.name`/`.description` English in every
 * locale; round 30.3ข (owner, 2026-09-11 — THAI_STYLE §2 layer 2 "English / ไทย") gives the Thai
 * visitor `category.labelTh` as the H1 and `category.descriptionTh` as the lede — the same two
 * strings the crawler gets as <title>/meta. English and Chinese keep the English name/description.
 */
export function CategoryPageHeader({ category }: { category: Category }) {
  const { dict, locale } = useLocale();
  const th = locale === "th";
  return (
    <PageHeader
      eyebrow={dict.catalog.eyebrow}
      title={th ? <CategoryLabel label={category.labelTh} /> : category.name}
      description={th ? thaiTypography(category.descriptionTh) : category.description}
    />
  );
}
