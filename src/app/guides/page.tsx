import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { Container } from "@/components/ui/Container";
import { GuidesPageHeader } from "@/components/content/GuidesPageHeader";
import { GuideCard } from "@/components/content/GuideCard";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical buying guidance and how-it-works explainers — not marketing copy.",
  ...canonicalFor("/guides"),
};

export default function GuidesPage() {
  return (
    <>
      <GuidesPageHeader />
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
