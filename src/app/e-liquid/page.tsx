import type { Metadata } from "next";
import Link from "next/link";
import { Citrus, Snowflake, Cookie, Coffee, Leaf } from "lucide-react";
import { flavorFamilies } from "@/data/flavors";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "E-Liquid",
  description: "An editorial map of flavor families — not a catalog of branded bottled e-liquid.",
};

const ICONS = {
  fruit: Citrus,
  "menthol-cooling": Snowflake,
  dessert: Cookie,
  beverage: Coffee,
  "tobacco-style": Leaf,
} as const;

export default function ELiquidPage() {
  return (
    <>
      <PageHeader
        eyebrow="E-Liquid"
        title="Flavor Families"
        description="This section is an editorial character guide to flavor families, not a catalog of specific branded bottled e-liquid — we don't have verified sourcing for individual e-liquid SKUs, so we're not inventing any."
      />
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flavorFamilies.map((family) => {
            const Icon = ICONS[family.slug];
            return (
              <Link
                key={family.id}
                href={`/e-liquid/${family.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-surface-border-soft bg-surface-1 p-6 transition-colors hover:border-ember/40"
              >
                <Icon size={24} className="text-steel group-hover:text-ember" aria-hidden />
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">{family.name}</h2>
                  <p className="mt-2 text-sm text-foreground-muted">{family.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 rounded-2xl border border-surface-border-soft bg-surface-1 p-6">
          <p className="text-sm leading-relaxed text-foreground-muted">
            This section makes no health, safety, or comparative claims about vaping, and does not distinguish
            nicotine-free from nicotine-containing products for every listing here.
            Nicotine strength always varies by product — check the product page or ask via LINE OA.
          </p>
        </div>
      </Container>
    </>
  );
}
