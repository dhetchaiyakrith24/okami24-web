"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatPuffs } from "@/lib/utils";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { labelLang } from "@/lib/label-lang";
import type { HeadlineSpec } from "@/lib/card-headline-spec";

/**
 * Round 30.4ข batch 2: the card's headline spec line, worded in the visitor's language —
 * "แบตเตอรี่ 1600mAh · สูงสุด 35 วัตต์" / "Battery 1600mAh · Up to 35W" / "电池 1600mAh · 最高 35W".
 * Same reason <PuffCount> exists: ProductCard is a Server Component with no locale in reach, so the
 * dictionary words are read here, on the smallest client boundary that can. The Thai line goes
 * through thaiTypography() after the numbers are filled in (the no-break between "35" and "วัตต์"
 * can only be placed once the number is there). Renders nothing when there is no spec — the
 * caller keeps the row's height.
 */
export function CardHeadlineSpec({ specs, compact = false }: { specs: HeadlineSpec[]; compact?: boolean }) {
  const { dict, locale } = useLocale();
  if (specs.length === 0) return null;
  const c = dict.catalog;
  const parts = specs.map((s) => {
    switch (s.kind) {
      case "battery":
        // compact (the 143px phone card): "1600mAh" alone — nothing else on a pod is measured in
        // mAh, and the full "แบตเตอรี่ 1600mAh · สูงสุด 35 วัตต์" measured 159px there.
        return compact ? `${s.mah}mAh` : c.cardBattery.replace("{mah}", `${s.mah}mAh`);
      case "maxWatt":
        return c.cardMaxWatt.replace("{w}", String(s.w));
      case "puffs":
        return formatPuffs(s.count, c.puffUnit);
      case "resistance":
        return c.cardResistance.replace("{ohm}", s.ohm);
      case "capacity":
        return c.cardCapacity.replace("{ml}", `${s.ml}mL`);
    }
  });
  // One line, one treatment: a line with any Thai in it ("1600mAh · สูงสุด 35 วัตต์") reads as a Thai
  // label end to end (sans, per the batch-8 rule in globals.css) rather than mono "1600MAH" beside
  // sans "สูงสุด 35 วัตต์"; a line with no Thai at all (English/Chinese page, or "0.7Ω") keeps mono.
  const lineLang = labelLang(parts.join(" "));
  return (
    <>
      {parts.map((p, i) => {
        const text = locale === "th" ? thaiTypographyNode(p) : p;
        return (
          <span key={i} className="contents">
            {i > 0 && <span aria-hidden> · </span>}
            <span className="label-mono" lang={lineLang}>{text}</span>
          </span>
        );
      })}
    </>
  );
}
