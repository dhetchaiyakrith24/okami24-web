"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { renderInline } from "@/components/content/ArticleBody";
import { productArticle } from "@/data/product-articles";
import { thaiTypographyNode } from "@/lib/thai-typography";

/**
 * Article round (02/10, designer option A): a product's article from src/data/product-articles.ts, in two parts —
 * `ProductArticleLede` (two sentences under the "more details" heading) and `ProductArticleBody` (buyer-question H3
 * blocks after the all-options grid). Both render nothing for a product with no article, so pages without one are
 * unchanged. Text is in the server HTML, fully visible (no collapse); typography and inline links = ArticleBody's.
 */
export function ProductArticleLede({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const a = productArticle(slug, locale);
  if (!a) return null;
  return <p className="mt-6 max-w-2xl text-[length:var(--text-body-lg)] leading-relaxed text-pretty text-foreground">{renderInline(a.lede, locale, "lede")}</p>;
}

export function ProductArticleBody({ slug }: { slug: string }) {
  const { locale } = useLocale();
  const a = productArticle(slug, locale);
  if (!a) return null;
  return (
    <div className="flex max-w-3xl flex-col gap-10 border-t border-surface-border-soft pt-10 lg:pt-14">
      {a.sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground lg:text-2xl">{locale === "th" ? thaiTypographyNode(s.heading) : s.heading}</h3>
          {s.paragraphs.map((p, pi) => (
            <p key={pi} className="text-base leading-relaxed text-foreground-muted">
              {renderInline(p, locale, `a${i}p${pi}`)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
