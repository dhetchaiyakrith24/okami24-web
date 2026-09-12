"use client";

import type { GuideSection } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { keepTogether } from "@/lib/thai-keep-together";

/**
 * Content-level i18n fix (owner quality review, 2026-09-02) — shared by Guides and Technology
 * detail pages. `translated` is an optional per-locale override supplied by the page (from
 * guides-copy.ts / technology-copy.ts); REPLACES `sections` when the current locale has a real
 * translation, otherwise falls back to the English `sections` — never blank, never a partial mix
 * of two languages within one article.
 */
export function ArticleBody({
  sections,
  translated,
  keepTogetherSite,
}: {
  sections: GuideSection[];
  translated?: Partial<Record<"th" | "zh", GuideSection[]>>;
  /** Round 30.4 Q1 — article id prefix for src/lib/thai-keep-together.ts (render-time word joiner,
   *  two approved paragraphs only); omitted = no effect. */
  keepTogetherSite?: string;
}) {
  const { locale } = useLocale();
  const activeSections = (locale === "th" || locale === "zh" ? translated?.[locale] : undefined) ?? sections;

  return (
    <div className="flex flex-col gap-10">
      {activeSections.map((section, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h2 className="font-display text-2xl font-semibold text-foreground">{section.heading}</h2>
          {section.paragraphs.map((p, pi) => (
            <p key={pi} className="text-base leading-relaxed text-foreground-muted">
              {keepTogetherSite ? keepTogether(p, `${keepTogetherSite}:${i}:${pi}`) : p}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
