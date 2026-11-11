"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DisposablesAllLink } from "@/components/catalog/DisposablesLinks";
import { useLiveCardStock } from "@/components/catalog/useLiveCardStock";
import { useEmptiedSimilar } from "@/components/product/useEmptiedSimilar";
import { shownRow, shownSimilar, type RelatedAnswer } from "@/lib/related-row";
import type { RelatedItem } from "@/lib/related-order";

/**
 * "สินค้าใกล้เคียง" on product, guide and technology pages (owner 07/11: "ต้องเป็นสินค้าที่มีในสต๊อกเท่านั้น … Auto ตลอด"). These pages
 * are prerendered, so they paint the build's row, then a product page (`slug`) asks /api/related/<slug>: the server's row from
 * live stock, the same code as the cart's, with the card data of anything the page was not built with. A failed request
 * leaves the build's row with the /api/stock answer over it; so do guide and technology pages, which name their own products.
 * Renders nothing when no card can be bought — never a sold-out card to fill the section. `similarSlugs` = the candidates of the
 * similar-models block on a page with nothing to buy: what that block shows stays out of this row.
 */
export function RelatedProducts({ items, slug, categoryId, similarSlugs = [] }: { items: RelatedItem[]; slug?: string; categoryId?: string; similarSlugs?: string[] }) {
  const changes = useLiveCardStock();
  const [answer, setAnswer] = useState<RelatedAnswer<RelatedItem> | null>(null);
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    fetch(`/api/related/${encodeURIComponent(slug)}`, { credentials: "omit" })
      .then((r) => (r.ok ? (r.json() as Promise<RelatedAnswer<RelatedItem>>) : null))
      .then((a) => {
        if (alive && a && Array.isArray(a.s) && Array.isArray(a.c)) setAnswer(a);
      })
      .catch(() => {
        /* no live answer — the page's own row stays */
      });
    return () => {
      alive = false;
    };
  }, [slug]);
  const fetched = useEmptiedSimilar(slug, similarSlugs.length, changes);
  // The block goes when this product is back in stock (SimilarInStock), so its cards come back to this row.
  const backInStock = slug ? changes?.[slug]?.s === true : false;
  const above = backInStock ? [] : shownSimilar(similarSlugs.length > 0 ? similarSlugs : fetched.map((i) => i.slug), changes);
  return <RelatedRow row={shownRow(items, changes, answer).filter((i) => !above.includes(i.slug))} categoryId={categoryId} />;
}

/** Same rail classes as ProductRail, for both kinds of card. */
export function RelatedRow({ row, categoryId }: { row: RelatedItem[]; categoryId?: string }) {
  const { dict } = useLocale();
  if (row.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="mb-8">
        <SectionHeading eyebrow={dict.product.relatedEyebrow} title={dict.product.relatedTitle} />
      </Container>
      <Container>
        <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 max-lg:mx-0 max-lg:grid max-lg:grid-cols-4 max-lg:gap-3 max-lg:overflow-visible max-lg:px-0 max-lg:pb-0 max-sm:grid-cols-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 lg:-mt-3 lg:pt-3">
          {row.map((item) => (
            <div key={item.slug} className="w-[240px] shrink-0 snap-start max-lg:w-auto sm:w-[280px]">
              {item.legacy ? <ProductCard product={item.legacy} taglineTh={item.taglineTh} /> : <PilotProductCard product={item.published!} />}
            </div>
          ))}
        </div>
        {categoryId === "disposables" && <DisposablesAllLink />}
      </Container>
    </section>
  );
}
