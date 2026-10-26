"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries";
import type { HeroType } from "@/data/home-hero";
import type { Guide } from "@/types/catalog";
import type { GuideHeadCopy } from "@/lib/guide-head-copy";
import { FLAVOR_COPY_TH, FLAVOR_COPY_ZH } from "@/i18n/flavor-copy";
import { labelLang } from "@/lib/label-lang";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { CategoryLabel } from "@/components/catalog/CategoryLabel";
import { pilotName } from "@/i18n/product-names-en";

/**
 * Round 30.3ข (owner, 2026-09-11) — the homepage sections are Server Components whose headings,
 * ledes and CTAs were English string props. These three tiny client components are the same trick
 * as <PuffCount> / <ProductTagline>: the server keeps rendering the section, only the text node
 * reads the visitor's language. They render a fragment — no wrapper element — so the DOM around
 * them is unchanged and the desktop layout does not move.
 */

/** One string from `dict.home` (see dictionaries/types.ts). `n` fills a `{n}` placeholder. */
export function HomeText({ k, n }: { k: keyof Dictionary["home"]; n?: number }) {
  const { dict, locale } = useLocale();
  const raw = dict.home[k];
  const text = n === undefined ? raw : raw.replace("{n}", String(n));
  // round 9: the dictionary deep-map returns plain strings, so the joined runs are laid here
  return <>{locale === "th" ? thaiTypographyNode(text) : text}</>;
}

/** A product type's name or one-line description — the hero tabs' words (dict.heroShowcase.types),
 *  reused as the titles of the type sections below the hero (src/data/home-sections.ts). */
export function HomeTypeText({ type, field }: { type: HeroType; field: "label" | "desc" }) {
  const { dict, locale } = useLocale();
  const text = dict.heroShowcase.types[type][field];
  return <>{locale === "th" ? thaiTypographyNode(text) : text}</>;
}

/** A guide's title or dek in the visitor's language — the same overlay GuideDetailPageHeader uses
 *  on the guide's own page, so the teaser card and the page it opens read the same words. */
export function GuideText({ copy, field, en }: { copy: GuideHeadCopy; field: "title" | "dek"; en: string }) {
  const { locale } = useLocale();
  // `copy` = guideHeadCopy(id) from the server section (src/lib/guide-head-copy.ts) — the full copy table stays off the browser.
  const overlay = locale === "th" ? copy.th : locale === "zh" ? copy.zh : undefined;
  return <>{locale === "th" && overlay?.[field] ? thaiTypographyNode(overlay[field]) : (overlay?.[field] ?? en)}</>;
}

/** The teaser card's "01 · category" eyebrow — the same dictionary labels and lang switch
 *  GuideCard uses on /guides, so the homepage card and the listing name the category alike
 *  (closing round 30.4ค, owner 1.7g 2026-09-16: Thai, not the English slug). Renders the span
 *  itself because its `lang` follows the label's script. */
export function GuideCategoryLabel({ index, category, className }: { index: number; category: Guide["category"]; className: string }) {
  const { dict } = useLocale();
  const labels: Record<Guide["category"], string> = {
    "getting-started": dict.guides.categoryGettingStarted,
    "buying-guide": dict.guides.categoryBuyingGuide,
    "how-it-works": dict.guides.categoryHowItWorks,
    maintenance: dict.guides.categoryMaintenance,
  };
  const label = labels[category];
  return (
    <span className={className} lang={labelLang(label)}>
      {String(index + 1).padStart(2, "0")} · {label}
    </span>
  );
}

/** A flavor family's name or first character note — the overlay ELiquidFamilyPageHeader uses. */
export function FlavorText({ id, field, en }: { id: string; field: "name" | "firstNote"; en: string }) {
  const { locale } = useLocale();
  const overlay = locale === "th" ? FLAVOR_COPY_TH[id] : locale === "zh" ? FLAVOR_COPY_ZH[id] : undefined;
  if (!overlay) return <>{en}</>;
  const text = field === "name" ? overlay.name : (overlay.characterNotes[0] ?? en);
  return <>{locale === "th" ? thaiTypographyNode(text) : text}</>;
}

/** The product index's box heading (HomeProductIndex): the "English / ไทย" label the category page's H1 uses on
 *  Thai, the short English name on en/zh — as CatalogBrowser's category links do (N6 26/10: en/zh showed the Thai half). */
export function HomeCategoryLabel({ labelTh, shortName }: { labelTh: string; shortName: string }) {
  const { locale } = useLocale();
  return locale === "th" ? <CategoryLabel label={labelTh} /> : <>{shortName}</>;
}

/** A product name in the index: the warehouse name on Thai, the English overlay on en/zh (product-names-en.ts). */
export function HomeIndexName({ slug, name }: { slug: string; name: string }) {
  const { locale } = useLocale();
  return <>{pilotName(slug, name, locale)}</>;
}
