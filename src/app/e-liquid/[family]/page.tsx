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
      <ELiquidFamilyPageHeader id={family.id} title={family.name} description={family.description} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <ELiquidCharacterNotesTitle />
        <ELiquidCharacterNotesList id={family.id} notes={family.characterNotes} />
        <ELiquidFamilyDisclaimer />
      </Container>
    </>
  );
}
