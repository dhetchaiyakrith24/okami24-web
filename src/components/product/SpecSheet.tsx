"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecChip } from "@/components/ui/SpecChip";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function SpecSheet({ product }: { product: Product }) {
  const { dict } = useLocale();
  const unverifiedCount = product.specifications.filter((s) => s.sourceStatus === "unverified").length;

  return (
    <section id="specifications" className="scroll-mt-20 border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow={dict.product.specsEyebrow}
          title={dict.product.specsTitle}
          // Round 30.4 batch 1: both ledes were hardcoded English and showed on every Thai/Chinese
          // product page — now dictionary strings (types.ts `product.specsUnverifiedNote` / `specsAllVerifiedNote`).
          description={
            unverifiedCount > 0
              ? dict.product.specsUnverifiedNote.replace("{n}", String(unverifiedCount)).replace("{m}", String(product.specifications.length))
              : dict.product.specsAllVerifiedNote
          }
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {product.specifications.map((spec) => (
            <SpecChip key={spec.key} spec={spec} unverifiedLabel={dict.product.unverifiedBadge} unverifiedTitle={dict.product.unverifiedTooltip} />
          ))}
        </div>
      </Container>
    </section>
  );
}
