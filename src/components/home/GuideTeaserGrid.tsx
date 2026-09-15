import Link from "next/link";
import type { Guide } from "@/types/catalog";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GuideText, HomeText } from "@/components/home/HomeCopy";

// Round 30.3ข: the heading, "All guides" link, the three card titles/deks and the reading-time
// label read the visitor's language (card copy through the same overlay the guide page uses); the
// "Guides & Learn" eyebrow and the mono category label stay English (THAI_STYLE §5 group ก).
export function GuideTeaserGrid({ guides }: { guides: Guide[] }) {
  return (
    <section className="bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Guides & Learn" title={<HomeText k="guidesTitle" />} className="max-w-xl" />
          <Link href="/guides" className="label-mono shrink-0 text-xs text-foreground-muted hover:text-ember">
            <HomeText k="guidesAll" />
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
                <span className="label-mono text-[0.65rem] text-steel" lang="en">{String(i + 1).padStart(2, "0")} · {guide.category.replaceAll("-", " ")}</span>
                <h3 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-ember">
                  <GuideText id={guide.id} field="title" en={guide.title} />
                </h3>
                <p className="line-clamp-3 text-sm text-foreground-muted">
                  <GuideText id={guide.id} field="dek" en={guide.dek} />
                </p>
              </div>
              <span className="label-mono text-[0.65rem] text-foreground-dim">
                <HomeText k="guideReadingTime" n={guide.readingTimeMin} />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
