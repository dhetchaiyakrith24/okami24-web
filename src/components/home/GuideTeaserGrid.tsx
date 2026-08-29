import Link from "next/link";
import type { Guide } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GuideTeaserGrid({ guides }: { guides: Guide[] }) {
  return (
    <section className="bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Guides & Learn" title="Buying guidance that isn't just marketing copy." className="max-w-xl" />
          <Link href="/guides" className="label-mono shrink-0 text-xs text-foreground-muted hover:text-ember">
            All guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {guides.map((guide, i) => (
            <Link
              key={guide.id}
              href={`/guides/${guide.slug}`}
              className="group flex flex-col justify-between gap-6 rounded-2xl border border-surface-border-soft bg-surface-0 p-6 transition-colors hover:border-steel/40"
            >
              <div className="flex flex-col gap-3">
                <span className="label-mono text-[0.65rem] text-steel">{String(i + 1).padStart(2, "0")} · {guide.category.replaceAll("-", " ")}</span>
                <h3 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-ember">
                  {guide.title}
                </h3>
                <p className="line-clamp-3 text-sm text-foreground-muted">{guide.dek}</p>
              </div>
              <span className="label-mono text-[0.65rem] text-foreground-dim">{guide.readingTimeMin} min read</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
