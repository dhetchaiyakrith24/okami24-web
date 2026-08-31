import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { PilotProductRail } from "./PilotProductRail";

/**
 * Same shell as the legacy `RelatedProducts`, fed by `getPilotRelatedProducts` (same-categoryId
 * pilot products only — see storefront-bridge.ts). Renders nothing when there are no truthful
 * matches, same as the legacy component — never padded with a weaker relation to fill the
 * section.
 */
export function PilotRelatedProducts({ products }: { products: StorefrontProductView[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-14 lg:py-20">
      <Container className="mb-8">
        <SectionHeading eyebrow="Related" title="You might also consider." />
      </Container>
      <Container>
        <PilotProductRail products={products} />
      </Container>
    </section>
  );
}
