"use client";

import { Badge } from "@/components/ui/Badge";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * The product's `editorialTag` as the customer sees it.
 *
 * Round 30.4 wiring ก8 (owner ruling 2026-09-12, docs/THAI_STYLE.md §7): of the values in
 * src/data/products/*.ts only "Flagship" is a label for customers — shown as the dictionary's
 * `product.flagshipBadge` ("รุ่นเรือธง" / "Flagship" / "旗舰"). "Tier-1 priority" and
 * "Retailer-confirmed" are internal curation notes: they render nothing here but STAY in the data,
 * because CatalogBrowser's "recommended" order sorts on `hasEditorialTag` (LAUNCH_AUDIT item 48 —
 * a sales-round question, not a language-round one). Same shape as PuffCount / ProductTagline:
 * the smallest client boundary that can read the locale, so ProductCard stays a Server Component.
 */
export function EditorialTagBadge({ tag, className }: { tag?: string; className?: string }) {
  const { dict } = useLocale();
  if (tag !== "Flagship") return null;
  return (
    <Badge tone="ember" className={className}>
      {dict.product.flagshipBadge}
    </Badge>
  );
}
