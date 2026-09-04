"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Same pattern as ComparePageHeader.tsx / FAQPageHeader.tsx. Eyebrow reuses `footer.learn`
 *  directly — its real English text already is "Learn", the same word this page always used. */
export function GuidesPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.footer.learn} title={dict.guides.pageTitle} description={dict.guides.pageDescription} />;
}
