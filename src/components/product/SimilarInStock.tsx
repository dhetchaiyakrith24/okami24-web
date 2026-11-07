"use client";

import { ProductCard } from "@/components/catalog/ProductCard";
import { useLiveCardStock } from "@/components/catalog/useLiveCardStock";
import { PilotProductCard } from "@/components/catalog-bridge/PilotProductCard";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { shownSimilar } from "@/lib/related-row";
import type { SimilarItem } from "@/lib/similar-in-stock";

/** Directly under the head of a page with nothing to buy: up to 4 close models a customer can buy now (round popular
 *  models 07/11). The list comes from the build; a card the live stock has since sold out drops out here. */
export function SimilarInStock({ items }: { items: SimilarItem[] }) {
  const { dict } = useLocale();
  const live = useLiveCardStock();
  const slugs = shownSimilar(items.map((i) => i.slug), live);
  const shown = items.filter((i) => slugs.includes(i.slug));
  if (shown.length === 0) return null;

  return (
    <section id="similar-in-stock" className="scroll-mt-24 border-b border-surface-border-soft bg-surface-0 py-10 lg:py-14">
      <Container className="mb-6">
        <SectionHeading eyebrow={dict.product.similarInStockEyebrow} title={dict.product.similarInStockTitle} />
      </Container>
      <Container>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {shown.map((item) => (
            <div key={item.slug} className="min-w-0">
              {item.legacy ? <ProductCard product={item.legacy} /> : <PilotProductCard product={item.published!} />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
