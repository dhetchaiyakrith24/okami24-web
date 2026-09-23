"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ThaiText } from "@/components/i18n/ThaiText";

/** Same pattern as ComparePageHeader.tsx / FAQPageHeader.tsx. */
export function TechnologyPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.technology.eyebrow} title={dict.technology.pageTitle} description={<ThaiText>{dict.technology.pageDescription}</ThaiText>} />;
}
