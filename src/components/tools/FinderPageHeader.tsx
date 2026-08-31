"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Same pattern as ComparePageHeader.tsx. */
export function FinderPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.footer.tools} title={dict.finder.pageTitle} description={dict.finder.pageDescription} />;
}
