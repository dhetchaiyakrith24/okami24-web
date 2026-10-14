"use client";

import Link from "next/link";
import type { Guide } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { GuideHeadCopy } from "@/lib/guide-head-copy";
import { labelLang } from "@/lib/label-lang";
import { thaiTypographyNode } from "@/lib/thai-typography";

/**
 * One card on `/guides`. SECOND owner review (2026-09-03) found this still showing English
 * title/dek under a Thai eyebrow/category — the real gap: guides-copy.ts's translations existed
 * (built for the detail page) but were never wired in here, the FIRST place a customer actually
 * reads guide content. Fixed by applying the exact same overlay-and-replace lookup the detail
 * page already uses, so the listing and detail pages can never disagree on language again.
 */
/** `copy` = guideHeadCopy(guide.id) from the server page (src/lib/guide-head-copy.ts) — keeps the full copy table off the browser. */
export function GuideCard({ guide, index, copy }: { guide: Guide; index: number; copy: GuideHeadCopy }) {
  const { dict, locale } = useLocale();
  const categoryLabels: Record<Guide["category"], string> = {
    "getting-started": dict.guides.categoryGettingStarted,
    "buying-guide": dict.guides.categoryBuyingGuide,
    "how-it-works": dict.guides.categoryHowItWorks,
    maintenance: dict.guides.categoryMaintenance,
  };
  // Round 10B (owner ruling 2026-09-24): a Thai-only guide is not listed on an English or Chinese page.
  if (guide.thaiOnly && locale !== "th") return null;
  const overlay = locale === "th" ? copy.th : locale === "zh" ? copy.zh : undefined;
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
          {/* Round 10B: typography on the Thai page whether or not a TH overlay exists — the round-10B articles are
              Thai-only records (same fix as GuideDetailPageHeader). English/Chinese pages unchanged. */}
          {locale === "th" ? thaiTypographyNode(overlay?.title ?? guide.title) : (overlay?.title ?? guide.title)}
        </h2>
        <p className="text-sm text-foreground-muted">{locale === "th" ? thaiTypographyNode(overlay?.dek ?? guide.dek) : (overlay?.dek ?? guide.dek)}</p>
      </div>
      <span className="label-mono text-[0.65rem] text-foreground-dim">
        {guide.readingTimeMin} {dict.guides.readingTimeMinutes}
      </span>
    </Link>
  );
}
