import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { FinderTool } from "@/components/tools/FinderTool";

export const metadata: Metadata = {
  title: "Product Finder",
  description: "Answer six quick questions and get matched to real catalog products, with an explanation of why each one fits.",
};

export default function FinderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Product Finder"
        description="Six questions, matched against real catalog attributes — not hard-coded picks. Every result shows why it matched."
      />
      <Container className="py-12 lg:py-20">
        <FinderTool />
      </Container>
    </>
  );
}
