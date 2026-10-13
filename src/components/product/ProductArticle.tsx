"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/i18n/config";
import { renderInline } from "@/components/content/ArticleBody";
import type { ProductArticleCopy } from "@/data/product-articles";
import { thaiTypographyNode } from "@/lib/thai-typography";

/**
 * Article round (02/10, designer option A): a product's article from src/data/product-articles.ts, in two parts —
 * `ProductArticleLede` (two sentences under the "more details" heading) and `ProductArticleBody` (buyer-question H3
 * blocks after the all-options grid). Both render nothing for a product with no article, so pages without one are
 * unchanged. Text is in the server HTML, fully visible (no collapse); typography and inline links = ArticleBody's.
 * `articles` = the product's article per locale, from the server page (src/lib/product-details-copy.ts — round SEO ฉ
 * batch 4, 14/10: importing the article table here shipped every product's article to the browser).
 */
type ArticlesByLocale = Partial<Record<Locale, ProductArticleCopy>>;

export function ProductArticleLede({ articles }: { articles: ArticlesByLocale }) {
  const { locale } = useLocale();
  const a = articles[locale];
  if (!a?.lede) return null;
  return <p className="mt-6 max-w-2xl text-[length:var(--text-body-lg)] leading-relaxed text-pretty text-foreground">{renderInline(a.lede, locale, "lede")}</p>;
}

export function ProductArticleBody({ articles }: { articles: ArticlesByLocale }) {
  const { locale } = useLocale();
  const a = articles[locale];
  // A lede-only article (owner 06/10 pm: M Bar 10K's one section went) renders no empty bordered block.
  if (!a || a.sections.length === 0) return null;
  return (
    <div className="flex max-w-3xl flex-col gap-10 border-t border-surface-border-soft pt-10 lg:gap-14 lg:pt-16">
      {a.sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground lg:text-2xl">{locale === "th" ? thaiTypographyNode(s.heading) : s.heading}</h3>
          {s.paragraphs.map((p, pi) => (
            <p key={pi} className="text-base leading-relaxed text-foreground-muted lg:text-[1.0625rem] lg:leading-8">
              {renderInline(p, locale, `a${i}p${pi}`)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
