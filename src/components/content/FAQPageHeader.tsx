"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pluralCount } from "@/i18n/dictionaries";

/**
 * Storefront quality-correction pass (2026-09-02) — same "use client" header pattern already
 * established by ComparePageHeader/FinderPageHeader/SearchPageHeader. `faq/page.tsx` previously
 * hardcoded this heading's eyebrow/title/description as plain English strings directly in a
 * Server Component, so it never localized regardless of the visitor's chosen locale — the fix is
 * applying the exact same pattern those other pages already use, not a new one.
 */
export function FAQPageHeader({ count }: { count: number }) {
  const { dict } = useLocale();
  return (
    <PageHeader
      eyebrow={dict.faq.eyebrow}
      title={dict.faq.pageTitle}
      description={`${count} ${pluralCount(count, dict.faq.pageDescriptionOne, dict.faq.pageDescriptionOther)}`}
    />
  );
}
