"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypography, thaiTypographyNode } from "@/lib/thai-typography";
import { FAQ_COPY_TH, FAQ_COPY_ZH } from "@/i18n/faq-copy";
import { ORDERING_FAQ_ID, ORDERING_ON_LINE_FAQ_ANSWER } from "@/data/faqs";
import type { FAQAction } from "@/types/catalog";

interface Item {
  id: string;
  question: string;
  answer: string;
  action?: FAQAction;
}

/** Resolves an FAQAction's `labelKey` to real localized text — `nav.*` for existing site
 *  destinations (Finder/Compare/Favorites/E-Liquid), `faq.*` for FAQ-specific labels (owner
 *  review, 2026-09-03 — "FAQ must become actionable"). See FAQAction's doc comment for why the
 *  label is keyed rather than stored as raw text. */
function actionLabel(dict: ReturnType<typeof useLocale>["dict"], labelKey: FAQAction["labelKey"]): string {
  switch (labelKey) {
    case "finder":
      return dict.nav.finder;
    case "compare":
      return dict.nav.compare;
    case "favorites":
      return dict.nav.favorites;
    case "eliquid":
      return dict.nav.eliquid;
    case "viewGuideCta":
      return dict.faq.viewGuideCta;
    case "contactLineCta":
      return dict.faq.contactLineCta;
    case "browseProductsCta":
      return dict.faq.browseProductsCta;
    // Round "SEO all keys" batch 6 (16/10): the three service pages, labelled by their existing nav words.
    case "howToOrder":
      return dict.nav.howToOrder;
    case "shipping":
      return dict.nav.shipping;
    case "warranty":
      return dict.nav.warranty;
  }
}

/** `orderingEnabled` comes from the /faq page (src/lib/commerce/ordering-mode.ts — owner
 *  2026-09-07): while online ordering is off, the one "how do I order" answer is swapped for the
 *  LINE version in the active language; every other item is untouched. Defaults to true. */
export function FAQAccordion({ items, orderingEnabled = true }: { items: Item[]; orderingEnabled?: boolean }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { dict, locale } = useLocale();
  // Content-level i18n fix (owner quality review, 2026-09-02) — REPLACES the English question/
  // answer with the real translation when one exists for this id+locale, rather than showing both
  // languages stacked (see faq-copy.ts's header comment for why that differs from the product-
  // tagline pattern). Falls back to English per-field when a translation is missing, never blank.
  const overlay = locale === "th" ? FAQ_COPY_TH : locale === "zh" ? FAQ_COPY_ZH : undefined;
  const localizedItems = items.map((item) => ({
    ...item,
    question: locale === "th" ? thaiTypography(overlay?.[item.id]?.question ?? item.question) : (overlay?.[item.id]?.question ?? item.question),
    answer:
      !orderingEnabled && item.id === ORDERING_FAQ_ID
        ? (locale === "th" ? thaiTypography(ORDERING_ON_LINE_FAQ_ANSWER[locale]) : ORDERING_ON_LINE_FAQ_ANSWER[locale])
        : (locale === "th" ? thaiTypography(overlay?.[item.id]?.answer ?? item.answer) : (overlay?.[item.id]?.answer ?? item.answer)),
  }));

  return (
    <div className="flex flex-col divide-y divide-surface-border-soft border-t border-surface-border-soft">
      {localizedItems.map((item) => {
        const open = openId === item.id;
        const isExternal = item.action?.href.startsWith("http");
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg font-semibold text-foreground">{locale === "th" ? thaiTypographyNode(item.question) : item.question}</span>
              <ChevronDown size={18} className={`shrink-0 text-foreground-dim transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
            </button>
            {open && (
              <div className="flex max-w-2xl flex-col items-start gap-3 pb-5">
                <p className="text-sm leading-relaxed text-foreground-muted">{locale === "th" ? thaiTypographyNode(item.answer) : item.answer}</p>
                {item.action &&
                  (isExternal ? (
                    <a
                      href={item.action.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember hover:text-ember-strong"
                    >
                      {actionLabel(dict, item.action.labelKey)}
                      <ArrowRight size={14} aria-hidden />
                    </a>
                  ) : (
                    <Link
                      href={item.action.href}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember hover:text-ember-strong"
                    >
                      {actionLabel(dict, item.action.labelKey)}
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
