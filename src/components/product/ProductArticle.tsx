"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Locale } from "@/i18n/config";
import { renderInline } from "@/components/content/ArticleBody";
import type { ProductArticleCopy } from "@/data/product-articles";
import { thaiTypographyNode } from "@/lib/thai-typography";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
  // Centred under the centred "more details" heading (owner 30/10) — every caller puts it under that heading.
  return <p className="mx-auto mt-6 max-w-2xl text-center text-[length:var(--text-body-lg)] leading-relaxed text-pretty text-foreground">{renderInline(a.lede, locale, "lede")}</p>;
}

/**
 * Articles queue 0211 batch 5 (Friday 03/11, option A): a legacy page without `storyDetails` has no ProductMoreDetails to
 * carry its article, so the page renders this after FeatureGrid — the same heading, lede and body, nothing new to look at.
 * No article = nothing rendered, so every legacy page without one stays as it was.
 */
export function ProductArticleSection({ articles }: { articles: ArticlesByLocale }) {
  const { dict, locale } = useLocale();
  if (!articles[locale]) return null;
  return (
    <section className="border-b border-surface-border-soft bg-surface-0" aria-labelledby="more-details-title">
      <Container className="pt-14 pb-10 lg:pt-20 lg:pb-14">
        <SectionHeading align="center" title={<span id="more-details-title">{dict.product.moreDetailsTitle}</span>} />
        <ProductArticleLede articles={articles} />
      </Container>
      <Container className="pb-14 lg:pb-20">
        <ProductArticleBody articles={articles} />
      </Container>
    </section>
  );
}

export function ProductArticleBody({ articles }: { articles: ArticlesByLocale }) {
  const { locale } = useLocale();
  const a = articles[locale];
  // A lede-only article (owner 06/10 pm: M Bar 10K's one section went) renders no empty bordered block.
  if (!a || a.sections.length === 0) return null;
  return (
    // Centred on wide screens under the centred heading + lede (Measure, owner 13/11) — a caller that already centres it
    // (ProductMoreDetails' stage) sees no change; below lg unchanged.
    <div className="flex max-w-3xl flex-col gap-10 border-t border-surface-border-soft pt-10 lg:mx-auto lg:gap-14 lg:pt-16">
      {a.sections.map((s, i) => (
        <div key={i} className="flex flex-col gap-3">
          <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-foreground lg:text-2xl">{locale === "th" ? thaiTypographyNode(s.heading) : s.heading}</h3>
          {s.paragraphs.map((p, pi) => (
            <p key={pi} className="text-base leading-relaxed text-foreground-muted lg:text-[1.0625rem] lg:leading-8">
              {renderInline(p, locale, `a${i}p${pi}`)}
            </p>
          ))}
          {/* Product-article round 13/11: the section's own picture (`ArticleSubsection.image`, in the type since 16/10 but
              never drawn). A cut-out floats small under its text; a poster gets the G5 poster frame. */}
          {s.image && (
            <div className={cn("mt-2", s.image.transparent ? "w-full max-w-[13rem] lg:max-w-[15rem]" : "overflow-hidden rounded-2xl border border-surface-border-soft bg-black")}>
              <Image src={s.image.src} alt={s.image.alt} width={s.image.width} height={s.image.height} sizes={s.image.transparent ? "240px" : "(min-width: 1024px) 768px, 100vw"} className="block h-auto w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
