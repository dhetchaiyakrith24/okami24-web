import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { FinderTool } from "@/components/tools/FinderTool";
import { FinderPageHeader } from "@/components/tools/FinderPageHeader";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Product Finder",
  description: "Answer six quick questions and get matched to real catalog products, with an explanation of why each one fits.",
  // noindex — a personalized quiz tool whose output depends on the visitor's answers; the tool
  // shell itself has no unique static content to rank on.
  ...canonicalFor("/finder"),
  ...NOINDEX_FOLLOW,
};

export default function FinderPage() {
  return (
    <>
      <FinderPageHeader />
      <Container className="py-12 lg:py-20">
        <FinderTool />
      </Container>
    </>
  );
}
