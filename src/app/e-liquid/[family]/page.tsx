import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { flavorFamilies, getFlavorFamily } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import {
  ELiquidFamilyPageHeader,
  ELiquidCharacterNotesTitle,
  ELiquidCharacterNotesList,
  ELiquidFamilyDisclaimer,
} from "@/components/content/ELiquidFamilyPageHeader";
import { canonicalFor, pageBreadcrumbJsonLd } from "@/lib/seo";
import { FLAVOR_COPY_TH } from "@/i18n/flavor-copy";

export function generateStaticParams() {
  return flavorFamilies.map((f) => ({ family: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ family: string }> }): Promise<Metadata> {
  const { family: familySlug } = await params;
  const family = getFlavorFamily(familySlug);
  if (!family) return {};
  // Round 30.3ข: search-facing text is Thai (see guides/[slug]/page.tsx) — the same Thai name/
  // description the page shows as its H1 and lede, English as the fallback.
  const th = FLAVOR_COPY_TH[family.id];
  return { title: th?.name ?? family.name, description: th?.description ?? family.description, ...canonicalFor(`/e-liquid/${familySlug}`) };
}

export default async function FlavorFamilyPage({ params }: { params: Promise<{ family: string }> }) {
  const { family: familySlug } = await params;
  const family = getFlavorFamily(familySlug);
  if (!family) notFound();
  // Batch 4: Home → Flavour-family trail from the same Thai name generateMetadata returns. The
  // page lists no products (it explains a taste family), so no CollectionPage is claimed.
  const familyPath = `/e-liquid/${familySlug}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageBreadcrumbJsonLd(FLAVOR_COPY_TH[family.id]?.name ?? family.name, familyPath)) }} />
      <ELiquidFamilyPageHeader id={family.id} title={family.name} description={family.description} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <ELiquidCharacterNotesTitle />
        <ELiquidCharacterNotesList id={family.id} notes={family.characterNotes} />
        <ELiquidFamilyDisclaimer />
      </Container>
    </>
  );
}
