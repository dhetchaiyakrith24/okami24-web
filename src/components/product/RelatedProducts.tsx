"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/catalog/ProductCard";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DisposablesAllLink } from "@/components/catalog/DisposablesLinks";
import { canBuyNow, useLiveCardStock } from "@/components/catalog/useLiveCardStock";
import { RELATED_SLOTS } from "@/lib/related-row";
import type { RelatedItem } from "@/lib/related-order";

/**
 * "สินค้าใกล้เคียง" on product, guide and technology pages. The page picks the candidates best first (`relatedFor`,
 * src/lib/related-order.ts: four tiers, what goes with the product first). These pages are prerendered, so what can be
 * bought is decided here: the build's stock first, then the warehouse's live answer (/api/stock, the one request every card
 * on the page shares) — owner 07/11 "ต้องเป็นสินค้าที่มีในสต๊อกเท่านั้น … Auto ตลอด". Renders nothing when no candidate can be
 * bought — never a sold-out card to fill the section. Same rail classes as ProductRail, for both kinds of card.
 */
export function RelatedProducts({ items, categoryId }: { items: RelatedItem[]; categoryId?: string }) {
  const { dict } = useLocale();
  const live = useLiveCardStock();
  const row = items.filter((i) => canBuyNow(live, i)).slice(0, RELATED_SLOTS);
  if (row.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="mb-8">
        <SectionHeading eyebrow={dict.product.relatedEyebrow} title={dict.product.relatedTitle} />
      </Container>
      <Container>
        <div className="rail-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 max-lg:mx-0 max-lg:grid max-lg:grid-cols-4 max-lg:gap-3 max-lg:overflow-visible max-lg:px-0 max-lg:pb-0 max-sm:grid-cols-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          {row.map((item) => (
            <div key={item.slug} className="w-[240px] shrink-0 snap-start max-lg:w-auto sm:w-[280px]">
              {item.legacy ? <ProductCard product={item.legacy} /> : <PilotProductCard product={item.published!} />}
            </div>
          ))}
        </div>
        {categoryId === "disposables" && <DisposablesAllLink />}
      </Container>
    </section>
  );
}
