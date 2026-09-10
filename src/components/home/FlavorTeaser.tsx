import Link from "next/link";
import { Citrus, Snowflake, Cookie, Coffee, Leaf } from "lucide-react";
import { flavorFamilies } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FlavorText, HomeText } from "@/components/home/HomeCopy";

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
        {/* Round 30.3ข: heading, lede, family names and first notes read the visitor's language
            (the same overlays the /e-liquid pages use); the eyebrow stays English (THAI_STYLE §5 ก). */}
        <SectionHeading eyebrow="E-Liquid" title={<HomeText k="flavorTitle" />} description={<HomeText k="flavorDescription" />} />
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
                  <p className="font-display text-lg font-semibold text-foreground">
                    <FlavorText id={family.id} field="name" en={family.name} />
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">
                    <FlavorText id={family.id} field="firstNote" en={family.characterNotes[0]} />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
