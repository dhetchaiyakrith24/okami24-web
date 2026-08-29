import Link from "next/link";
import { Citrus, Snowflake, Cookie, Coffee, Leaf } from "lucide-react";
import { flavorFamilies } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ICONS = {
  fruit: Citrus,
  "menthol-cooling": Snowflake,
  dessert: Cookie,
  beverage: Coffee,
  "tobacco-style": Leaf,
} as const;

export function FlavorTeaser() {
  return (
    <section className="border-b border-surface-border-soft bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          eyebrow="E-Liquid"
          title="Five flavor families, one editorial map."
          description="Not a product catalog of bottled e-liquid — a character guide to what each flavor family actually tastes like, so you know what you're choosing before you buy."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {flavorFamilies.map((family) => {
            const Icon = ICONS[family.slug];
            return (
              <Link
                key={family.id}
                href={`/e-liquid/${family.slug}`}
                className="group flex flex-col gap-4 rounded-2xl border border-surface-border-soft bg-surface-0 p-5 transition-colors hover:border-ember/40"
              >
                <Icon size={22} className="text-steel group-hover:text-ember" aria-hidden />
                <div>
                  <p className="font-display text-lg font-semibold text-foreground">{family.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">{family.characterNotes[0]}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
