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
        <p className="text-lg text-foreground">{dict.guides.thaiOnlyNotice}</p>
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
