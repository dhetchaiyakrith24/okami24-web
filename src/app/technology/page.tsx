import type { Metadata } from "next";
import Link from "next/link";
import { technologyEntries } from "@/data/technology";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Technology",
  description: "How the mechanisms behind current pod and disposable devices actually work — mesh coils, multi-resistance cartridges, chip platforms, and control systems.",
};

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Understand"
        title="Technology"
        description="How the mechanisms behind current pod and disposable devices actually work."
      />
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {technologyEntries.map((entry) => (
            <Link
              key={entry.id}
              href={`/technology/${entry.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-surface-border-soft bg-surface-1 p-6 transition-colors hover:border-ember/40"
            >
              <h2 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-ember">{entry.name}</h2>
              <p className="text-sm text-foreground-muted">{entry.summary}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
