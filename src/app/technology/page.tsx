import type { Metadata } from "next";
import { technologyEntries } from "@/data/technology";
import { Container } from "@/components/ui/Container";
import { TechnologyPageHeader } from "@/components/content/TechnologyPageHeader";
import { TechnologyEntryGrid } from "@/components/content/TechnologyEntryGrid";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Technology",
  description: "How the mechanisms behind current pod and disposable devices actually work — mesh coils, multi-resistance cartridges, chip platforms, and control systems.",
  ...canonicalFor("/technology"),
};

export default function TechnologyPage() {
  return (
    <>
      <TechnologyPageHeader />
      <Container className="py-12 lg:py-16">
        <TechnologyEntryGrid entries={technologyEntries} />
      </Container>
    </>
  );
}
