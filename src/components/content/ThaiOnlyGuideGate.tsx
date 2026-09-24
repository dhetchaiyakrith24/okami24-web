"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Container } from "@/components/ui/Container";

/**
 * Round 10B (owner ruling 2026-09-24): a Thai-only guide (Guide.thaiOnly) has no English or Chinese version. On the
 * Thai page it renders as usual; on an English or Chinese page its URL shows only one line — "This guide is available in
 * Thai only." / "本文仅提供泰语版本。" — and a link back to /guides, so the visitor never gets a page of Thai text.
 * Listings drop such a guide on en/zh (GuideCard, RelatedArticles). Standing rule: docs/THAI_STYLE.md §2.
 */
export function ThaiOnlyGuideGate({ thaiOnly, children }: { thaiOnly?: boolean; children: ReactNode }) {
  const { dict, locale } = useLocale();
  if (!thaiOnly || locale === "th") return <>{children}</>;
  return (
    <Container className="max-w-3xl py-16 lg:py-24">
      <div className="flex flex-col gap-4" data-thai-only-notice>
        {/* <h1>, not <p> (designer, owner left it to the main agent 2026-09-24): on en/zh this line replaces the whole
            article, its Thai <h1> included — without it the page has no heading for screen readers. Tailwind's reset
            gives h1 no size or weight of its own, so it looks exactly like the old <p>. */}
        <h1 className="text-lg text-foreground">{dict.guides.thaiOnlyNotice}</h1>
        <Link href="/guides" className="inline-flex items-baseline gap-2 text-base text-foreground-muted transition-colors hover:text-ember">
          <span aria-hidden className="text-foreground-dim">
            ←
          </span>
          <span className="underline underline-offset-4">{dict.guides.pageTitle}</span>
        </Link>
      </div>
    </Container>
  );
}
