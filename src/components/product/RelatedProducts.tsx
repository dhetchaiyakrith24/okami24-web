"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductRail } from "@/components/catalog/ProductRail";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function RelatedProducts({ products }: { products: Product[] }) {
  const { dict } = useLocale();
  if (products.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="mb-8">
        <SectionHeading eyebrow={dict.product.relatedEyebrow} title={dict.product.relatedTitle} />
      </Container>
      <Container>
        <ProductRail products={products} />
      </Container>
    </section>
  );
}
