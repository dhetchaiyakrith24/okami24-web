"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PRODUCT_COPY_TH } from "@/i18n/product-copy-th";

/**
 * Round 30.4 batches 5/6 (owner, 2026-09-13): a Thai visitor reads the feature cards from the
 * `features` overlay in product-copy-th.ts (keyed by feature id) instead of the English data.
 * A card with no Thai entry keeps its English text, and an entry without a title keeps the
 * English title (brand-coined feature names). Markup and classes are exactly what they were —
 * only which string each <h3>/<p> holds changes.
 */
export function FeatureGrid({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  const copyTh = locale === "th" ? PRODUCT_COPY_TH[product.slug]?.features : undefined;
  if (product.features.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={dict.product.featuresEyebrow} title={dict.product.featuresTitle} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((feature, i) => (
            <div key={feature.id} className="flex flex-col gap-3 rounded-2xl border border-surface-border-soft bg-surface-0 p-6">
              <span className="label-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-semibold leading-tight text-foreground">{copyTh?.[feature.id]?.title ?? feature.title}</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{copyTh?.[feature.id]?.description ?? feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
