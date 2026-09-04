import type { Metadata } from "next";
import { flavorFamilies } from "@/data/flavors";
import { Container } from "@/components/ui/Container";
import { ELiquidPageHeader, ELiquidDisclaimer } from "@/components/content/ELiquidPageHeader";
import { FlavorFamilyGrid } from "@/components/content/FlavorFamilyGrid";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "E-Liquid",
  description: "An editorial map of flavor families — not a catalog of branded bottled e-liquid.",
  ...canonicalFor("/e-liquid"),
};

export default function ELiquidPage() {
  return (
    <>
      <ELiquidPageHeader />
      <Container className="py-12 lg:py-16">
        <FlavorFamilyGrid families={flavorFamilies} />
        <ELiquidDisclaimer />
      </Container>
    </>
  );
}
