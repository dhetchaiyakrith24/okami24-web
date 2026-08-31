"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Category } from "@/types/catalog";

/**
 * Split out of products/[slug]/page.tsx (same reason as SearchPageHeader.tsx) so the page can
 * stay a plain Server Component — only the eyebrow needs the locale dictionary. Phase 3.2.2:
 * category display names ("Open-System Pod Devices" etc.) are taxonomy/product-line terms, not
 * generic UI chrome — the owner explicitly wants these to stay English in every locale (they read
 * more natural/standard in English than a Thai translation), so `category.name`/`.description`
 * are used as-is, unconditionally. Only `eyebrow` ("Catalog") is a real UI label and localizes.
 */
export function CategoryPageHeader({ category }: { category: Category }) {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.catalog.eyebrow} title={category.name} description={category.description} />;
}
