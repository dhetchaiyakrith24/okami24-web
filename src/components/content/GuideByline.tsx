"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

/**
 * Round SEO ฉ batch 4 (2026-10-12, designer option C, owner OK): who wrote the guide and when, under the H1 —
 * "โดย ทีม OKami24 · เผยแพร่ 9 ต.ค. 2026 · อัปเดต 12 ต.ค. 2026". The updated part shows only when the guide's own text
 * changed after it was published (per-guide date: scripts/lib/guide-dates.ts → content-dates.json "guides"), the same
 * date the Article JSON-LD carries, so the page never shows a freshness Google is not told about (or the reverse).
 * Dates are formatted by a fixed month table, not Intl, so the server HTML and the hydrated page always agree.
 * Each "·" part is nowrap; at 390 the line wraps between parts (flex-wrap).
 */
const MONTHS: Record<"th" | "en", string[]> = {
  th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export function formatGuideDate(isoDay: string, locale: "th" | "en" | "zh"): string {
  const [y, m, d] = isoDay.split("-").map(Number);
  if (locale === "zh") return `${y}年${m}月${d}日`;
  return `${d} ${MONTHS[locale][m - 1]} ${y}`;
}

export function GuideByline({ publishedAt, modifiedAt }: { publishedAt: string; modifiedAt: string }) {
  const { dict, locale } = useLocale();
  const t = dict.guides;
  const [before, after = ""] = t.bylineAuthor.split("{team}");
  // Each part carries its own "·" before it, inside a left gutter the row pulls out of view (-ml + overflow-hidden):
  // a part that starts a new line at 390 has its dot clipped, so no line ever ends or starts on a dangling "·"
  // (checker #453 owner-eye note).
  const part = "relative whitespace-nowrap pl-4 before:absolute before:left-[0.3rem] before:content-['·']";
  return (
    <p className="label-mono overflow-hidden text-xs text-foreground-dim">
      <span className="-ml-4 flex flex-wrap gap-y-1">
        <span className={part}>
          {before}
          <Link href="/about" className="underline decoration-surface-border underline-offset-4 hover:text-foreground">
            {t.bylineTeam}
          </Link>
          {after}
        </span>
        <span className={part}>
          {t.bylinePublished} <time dateTime={publishedAt}>{formatGuideDate(publishedAt, locale)}</time>
        </span>
        {modifiedAt > publishedAt && (
          <span className={part}>
            {t.bylineUpdated} <time dateTime={modifiedAt}>{formatGuideDate(modifiedAt, locale)}</time>
          </span>
        )}
      </span>
    </p>
  );
}
