"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";

/**
 * Fixes a real regression found during the owner quality review (2026-09-02): `/guides/[slug]`
 * was calling `<PageHeader>` directly from its Server Component with a hardcoded English eyebrow
 * ("Guide · N min read") and English title/dek — exactly the "hardcoded PageHeader" class of bug
 * the earlier i18n pass's contract test was meant to catch (see i18n-contract-test.ts), missed
 * here because this call sat in a `[slug]` dynamic route the static scan didn't enumerate.
 * `id` looks up a real TH/ZH translation of this guide's own title/dek in guides-copy.ts.
 */
export function GuideDetailPageHeader({
  id,
  title,
  dek,
  readingTimeMin,
}: {
  id: string;
  title: string;
  dek: string;
  readingTimeMin: number;
}) {
  const { dict, locale } = useLocale();
  const overlay = locale === "th" ? GUIDES_COPY_TH[id] : locale === "zh" ? GUIDES_COPY_ZH[id] : undefined;
  return (
    <PageHeader
      eyebrow={`${dict.guides.detailEyebrow} · ${readingTimeMin} ${dict.guides.readingTimeMinutes}`}
      title={overlay?.title ?? title}
      description={overlay?.dek ?? dek}
    />
  );
}
