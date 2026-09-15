"use client";

import Link from "next/link";
import type { Guide } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { labelLang } from "@/lib/label-lang";
import { thaiTypography } from "@/lib/thai-typography";

/**
 * One card on `/guides`. SECOND owner review (2026-09-03) found this still showing English
 * title/dek under a Thai eyebrow/category — the real gap: guides-copy.ts's translations existed
 * (built for the detail page) but were never wired in here, the FIRST place a customer actually
 * reads guide content. Fixed by applying the exact same overlay-and-replace lookup the detail
 * page already uses, so the listing and detail pages can never disagree on language again.
 */
export function GuideCard({ guide, index }: { guide: Guide; index: number }) {
  const { dict, locale } = useLocale();
  const categoryLabels: Record<Guide["category"], string> = {
    "getting-started": dict.guides.categoryGettingStarted,
    "buying-guide": dict.guides.categoryBuyingGuide,
    "how-it-works": dict.guides.categoryHowItWorks,
    maintenance: dict.guides.categoryMaintenance,
  };
  const overlay = locale === "th" ? GUIDES_COPY_TH[guide.id] : locale === "zh" ? GUIDES_COPY_ZH[guide.id] : undefined;
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex flex-col justify-between gap-6 rounded-2xl border border-surface-border-soft bg-surface-1 p-6 transition-colors hover:border-steel/40"
    >
      <div className="flex flex-col gap-3">
        <span className="label-mono text-[0.65rem] text-steel" lang={labelLang(categoryLabels[guide.category])}>
          {String(index + 1).padStart(2, "0")} · {categoryLabels[guide.category]}
        </span>
        <h2 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-ember">
          {locale === "th" && overlay?.title ? thaiTypography(overlay.title) : (overlay?.title ?? guide.title)}
        </h2>
        <p className="text-sm text-foreground-muted">{locale === "th" && overlay?.dek ? thaiTypography(overlay.dek) : (overlay?.dek ?? guide.dek)}</p>
      </div>
      <span className="label-mono text-[0.65rem] text-foreground-dim">
        {guide.readingTimeMin} {dict.guides.readingTimeMinutes}
      </span>
    </Link>
  );
}
