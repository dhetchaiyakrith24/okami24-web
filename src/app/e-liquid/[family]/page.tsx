import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { flavorFamilies, getFlavorFamily } from "@/data/flavors";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { canonicalFor } from "@/lib/seo";

export function generateStaticParams() {
  return flavorFamilies.map((f) => ({ family: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ family: string }> }): Promise<Metadata> {
  const { family: familySlug } = await params;
  const family = getFlavorFamily(familySlug);
  if (!family) return {};
  return { title: family.name, description: family.description, ...canonicalFor(`/e-liquid/${familySlug}`) };
}

export default async function FlavorFamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const { family: familySlug } = await params;
  const family = getFlavorFamily(familySlug);
  if (!family) notFound();

  return (
    <>
      <PageHeader eyebrow="E-Liquid · Flavor Family" title={family.name} description={family.description} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <h2 className="font-display text-xl font-semibold text-foreground">Character notes</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {family.characterNotes.map((note, i) => (
            <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground-muted">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel" aria-hidden />
              {note}
            </li>
          ))}
        </ul>
        <p className="mt-10 text-xs leading-relaxed text-foreground-dim">
          This is an editorial flavor-family description, not a listing of specific branded e-liquid products —
          we don&apos;t have verified sourcing for individual SKUs in this category.
        </p>
      </Container>
    </>
  );
}
