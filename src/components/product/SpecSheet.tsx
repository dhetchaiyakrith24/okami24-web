import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpecChip } from "@/components/ui/SpecChip";

export function SpecSheet({ product }: { product: Product }) {
  const unverifiedCount = product.specifications.filter((s) => s.sourceStatus === "unverified").length;

  return (
    <section id="specifications" className="scroll-mt-20 border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Specifications"
          title="What's actually documented."
          description={
            unverifiedCount > 0
              ? `${unverifiedCount} of ${product.specifications.length} fields could not be independently confirmed and are labeled unverified rather than guessed.`
              : "Every field below was independently confirmed against an official or reliable source."
          }
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {product.specifications.map((spec) => (
            <SpecChip key={spec.key} spec={spec} />
          ))}
        </div>
      </Container>
    </section>
  );
}
