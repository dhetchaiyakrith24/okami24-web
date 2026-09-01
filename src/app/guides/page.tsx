import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/data/guides";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { canonicalFor } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guides",
  description: "Practical buying guidance and how-it-works explainers — not marketing copy.",
  ...canonicalFor("/guides"),
};

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "buying-guide": "Buying Guide",
  "how-it-works": "How It Works",
  maintenance: "Maintenance",
};

export default function GuidesPage() {
  return (
    <>
      <PageHeader eyebrow="Learn" title="Guides" description="Practical buying guidance and how-it-works explainers — not marketing copy." />
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide, i) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col justify-between gap-6 rounded-2xl border border-surface-border-soft bg-surface-1 p-6 transition-colors hover:border-steel/40"
            >
              <div className="flex flex-col gap-3">
                <span className="label-mono text-[0.65rem] text-steel">
                  {String(i + 1).padStart(2, "0")} · {CATEGORY_LABELS[guide.category]}
                </span>
                <h2 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-ember">{guide.title}</h2>
                <p className="text-sm text-foreground-muted">{guide.dek}</p>
              </div>
              <span className="label-mono text-[0.65rem] text-foreground-dim">{guide.readingTimeMin} min read</span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
