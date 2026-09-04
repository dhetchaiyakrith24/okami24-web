"use client";

import type { SiteFAQ } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** The `<h2>` category label above each FAQ group — previously a hardcoded English
 *  `Record<category, string>` map in `faq/page.tsx`, so it never localized. */
export function FAQCategoryHeading({ category }: { category: SiteFAQ["category"] }) {
  const { dict } = useLocale();
  const labels: Record<SiteFAQ["category"], string> = {
    ordering: dict.faq.categoryOrdering,
    devices: dict.faq.categoryDevices,
    "e-liquid": dict.faq.categoryELiquid,
    safety: dict.faq.categorySafety,
    account: dict.faq.categoryAccount,
  };
  return <h2 className="label-mono mb-2 text-xs text-ember">{labels[category]}</h2>;
}
