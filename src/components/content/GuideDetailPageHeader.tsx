"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { GuideByline } from "@/components/content/GuideByline";

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
  byline,
}: {
  id: string;
  title: string;
  dek: string;
  readingTimeMin: number;
  /** Round SEO ฉ batch 4: the who/when line under the H1 (GuideByline) — omitted on the DNS help page. */
  byline?: { publishedAt: string; modifiedAt: string };
}) {
  const { dict, locale } = useLocale();
  const overlay = locale === "th" ? GUIDES_COPY_TH[id] : locale === "zh" ? GUIDES_COPY_ZH[id] : undefined;
  // Round 10B (designer, 2026-09-24): the typography used to run only when a TH overlay existed, but the round-10B
  // articles are Thai-only and keep their Thai in the record itself — their H1/dek skipped it ("M | Switch" at 390).
  // On the Thai page it now runs on whichever string is shown; English/Chinese pages are unchanged.
  const shownTitle = overlay?.title ?? title;
  const shownDek = overlay?.dek ?? dek;
  return (
    <PageHeader
      eyebrow={`${dict.guides.detailEyebrow} · ${readingTimeMin} ${dict.guides.readingTimeMinutes}`}
      title={locale === "th" ? thaiTypographyNode(shownTitle) : shownTitle}
      description={locale === "th" ? thaiTypographyNode(shownDek) : shownDek}
      meta={byline && <GuideByline publishedAt={byline.publishedAt} modifiedAt={byline.modifiedAt} />}
    />
  );
}
