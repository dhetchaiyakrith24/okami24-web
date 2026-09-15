import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HomeText } from "@/components/home/HomeCopy";

export function CompareCTA({ products }: { products: Product[] }) {
  return (
    <section className="border-b border-surface-border-soft bg-surface-0 py-16 lg:py-20">
      <Container className="flex flex-col items-center gap-8 rounded-3xl border border-surface-border bg-surface-1 px-6 py-12 text-center lg:px-16">
        <div className="flex items-center gap-3">
          {products.slice(0, 3).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <div className="h-20 w-16 opacity-90">
                <ProductMedia product={p} sizes="10vw" />
              </div>
              {i < 2 && <span className="label-mono text-xs text-foreground-dim" lang="en">vs</span>}
            </div>
          ))}
        </div>
        <SectionHeadingInline />
        <Button href="/compare">
          <HomeText k="compareCta" />
        </Button>
      </Container>
    </section>
  );
}

// Round 30.3ข: heading, lede and button read the visitor's language via <HomeText>; the "Compare"
// eyebrow and the "vs" separators stay English (THAI_STYLE §5 group ก).
function SectionHeadingInline() {
  return (
    <div className="flex flex-col gap-3">
      <span className="label-mono text-xs text-ember" lang="en">Compare</span>
      <h2 className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
        <HomeText k="compareTitle" />
      </h2>
      <p className="mx-auto max-w-lg text-base text-foreground-muted">
        <HomeText k="compareDescription" />
      </p>
    </div>
  );
}
