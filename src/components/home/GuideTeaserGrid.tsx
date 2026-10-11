import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Guide } from "@/types/catalog";
import { DNS_GUIDE_ID, getGuide } from "@/data/guides";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GuideCategoryLabel, GuideText, HomeText } from "@/components/home/HomeCopy";

// Round 30.3ข: the heading, "All guides" link, the three card titles/deks and the reading-time
// label read the visitor's language (card copy through the same overlay the guide page uses); the
// "Guides & Learn" eyebrow stays English (THAI_STYLE §5 group ก); the mono category label reads the
// dictionary like /guides since the closing round of 30.4ค (owner 1.7g, 2026-09-16).
//
// Round 30.4ข batch 1 (owner 2026-09-16, close-list D): the heading used to sit in a `max-w-xl`
// box, so the Thai H2 wrapped at ~576px while the rest of the row was empty. Like the product
// rails (ProductRailSection), the heading now takes the width the flex row gives it and only
// wraps when it meets the "All guides" link.
export function GuideTeaserGrid({ guides }: { guides: Guide[] }) {
  const helpGuide = getGuide(DNS_GUIDE_ID);
  return (
    <section className="bg-surface-1 py-14 lg:py-20">
      <Container className="flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Guides & Learn" title={<HomeText k="guidesTitle" />} />
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
                <GuideCategoryLabel index={i} category={guide.category} className="label-mono text-[0.65rem] text-steel" />
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
        {helpGuide && (
          // Round "site unreachable" (owner 11/10, choice C): the DNS help page as one full-width row under the three
          // cards — not a 4th card, which would strand alone on a new row of the 3-column grid (designer 11/10).
          <Link
            href={`/guides/${helpGuide.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-surface-border-soft bg-surface-0 p-6 transition-colors hover:border-steel/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <div className="flex min-w-0 flex-col gap-2">
              <span className="label-mono text-[0.65rem] text-steel" lang="en">
                Help
              </span>
              {/* text-balance: at 390 the greedy wrap split "มือ|ถือ"; balanced lines break at the space after "วิธีเปลี่ยน"
                  instead, the way the guide's own H1 wraps. */}
              <h3 className="font-display text-xl font-semibold leading-tight text-balance text-foreground group-hover:text-ember">
                <GuideText id={helpGuide.id} field="title" en={helpGuide.title} />
              </h3>
              {/* No line clamp (checker 11/10): at 390 a 2-line clamp cut the dek mid-sentence; it is one card, so it may run 3 lines. */}
              <p className="text-sm text-foreground-muted">
                <GuideText id={helpGuide.id} field="dek" en={helpGuide.dek} />
              </p>
            </div>
            <ArrowRight className="hidden h-5 w-5 shrink-0 text-foreground-dim transition-colors group-hover:text-ember sm:block" aria-hidden />
          </Link>
        )}
      </Container>
    </section>
  );
}
