"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import type { RelatedArticle } from "@/lib/article-relevance";

/**
 * Round "backlink" (2026-09-22): the way out of a product page for someone who is not sure yet.
 * Before it, 0 of the 53 product pages linked to any of the 12 articles, while the articles
 * carried 65 links the other way — so an article was reachable from the index, from another
 * article, and nowhere else.
 *
 * NO new sentence anywhere on purpose (the round's rule): every link's label is the article's own
 * title, in the visitor's language through the same overlay /guides uses, and the one line above
 * them is `product.readMoreEyebrow` — "อ่านต่อ" (owner, 2026-09-22), the words the article bodies
 * already use for an onward link ("อ่านต่อที่ […]"), on all 53 pages alike. Which articles appear
 * is decided by src/lib/article-relevance.ts from the data, never here, and a product with no
 * genuinely related article renders nothing at all.
 * Nothing in this block sells: no price, no cart, no "buy" — it is the reading exit.
 */
export function RelatedArticles({ articles: thaiArticles, otherLocaleArticles }: { articles: RelatedArticle[]; otherLocaleArticles?: RelatedArticle[] }) {
  const { dict, locale } = useLocale();
  // Round 10B: en/zh get the list built without Thai-only guides (article-relevance `skipThaiOnly`), so an English or
  // Chinese visitor is never sent to a page that only says "available in Thai only".
  const articles = locale === "th" ? thaiArticles : (otherLocaleArticles ?? thaiArticles);
  if (articles.length === 0) return null;

  const label = (a: RelatedArticle) => {
    // titleTh / titleZh come with the list from the server (article-relevance.ts) — the copy tables stay off the browser.
    const overlay = locale === "th" ? a.titleTh : locale === "zh" ? a.titleZh : undefined;
    const text = overlay ?? a.title;
    return locale === "th" ? thaiTypographyNode(text) : text;
  };

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-10 lg:py-12" data-related-articles>
      <Container className="flex flex-col gap-4">
        <p className="label-mono text-[0.65rem] text-foreground-dim">{dict.product.readMoreEyebrow}</p>
        <ul className="flex flex-col gap-2">
          {articles.map((a) => (
            <li key={a.href}>
              <Link
                href={a.href}
                className="inline-flex items-baseline gap-2 text-base text-foreground transition-colors hover:text-ember lg:text-lg"
              >
                <span aria-hidden className="text-foreground-dim">
                  →
                </span>
                <span className="underline decoration-surface-border underline-offset-4 group-hover:decoration-ember">{label(a)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
