"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Same pattern as SearchPageHeader.tsx — keeps compare/page.tsx a plain Server Component
 *  reading `searchParams` while this one heading still picks up the visitor's locale. */
export function ComparePageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.footer.tools} title={dict.compare.pageTitle} description={dict.compare.pageDescription} />;
}
