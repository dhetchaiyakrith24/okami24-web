"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypography } from "@/lib/thai-typography";
import { TECHNOLOGY_COPY_TH, TECHNOLOGY_COPY_ZH } from "@/i18n/technology-copy";

/**
 * Same pattern as TechnologyPageHeader.tsx for the eyebrow (reuses `nav.technology`). Content-
 * level i18n fix (owner quality review, 2026-09-02): `id` looks up a real TH/ZH translation of
 * this entry's own name/summary in technology-copy.ts, replacing the English `title`/
 * `description` props when one exists for the active locale — falls back to the English props
 * otherwise, never blank.
 */
export function TechnologyEntryPageHeader({ id, title, description }: { id: string; title: string; description: string }) {
  const { dict, locale } = useLocale();
  const overlay = locale === "th" ? TECHNOLOGY_COPY_TH[id] : locale === "zh" ? TECHNOLOGY_COPY_ZH[id] : undefined;
  return <PageHeader eyebrow={dict.nav.technology} title={locale === "th" && overlay?.name ? thaiTypography(overlay.name) : (overlay?.name ?? title)} description={locale === "th" && overlay?.summary ? thaiTypography(overlay.summary) : (overlay?.summary ?? description)} />;
}
