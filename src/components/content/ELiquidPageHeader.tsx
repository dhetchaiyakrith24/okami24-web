"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** Same pattern as ComparePageHeader.tsx / FAQPageHeader.tsx. */
export function ELiquidPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.eliquid.eyebrow} title={dict.eliquid.pageTitle} description={dict.eliquid.pageDescription} />;
}

/** The compliance/scope disclaimer at the bottom of the e-liquid page — same hardcoded-English
 *  bug as the header above, fixed the same way. Kept in this file rather than a new one since
 *  it's a single paragraph tightly coupled to this one page. */
export function ELiquidDisclaimer() {
  const { dict } = useLocale();
  return (
    <div className="mt-14 rounded-2xl border border-surface-border-soft bg-surface-1 p-6">
      <p className="text-sm leading-relaxed text-foreground-muted">{dict.eliquid.disclaimer}</p>
    </div>
  );
}
