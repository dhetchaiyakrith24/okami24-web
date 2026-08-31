"use client";

import type { Product } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function FeatureGrid({ product }: { product: Product }) {
  const { dict } = useLocale();
  if (product.features.length === 0) return null;

  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow={dict.product.featuresEyebrow} title={dict.product.featuresTitle} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {product.features.map((feature, i) => (
            <div key={feature.id} className="flex flex-col gap-3 rounded-2xl border border-surface-border-soft bg-surface-0 p-6">
              <span className="label-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-semibold leading-tight text-foreground">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
