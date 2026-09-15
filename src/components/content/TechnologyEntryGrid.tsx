"use client";

import Link from "next/link";
import type { TechnologyEntry } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypography } from "@/lib/thai-typography";
import { TECHNOLOGY_COPY_TH, TECHNOLOGY_COPY_ZH } from "@/i18n/technology-copy";

/**
 * Moved out of `/technology`'s Server Component page (owner review, 2026-09-03 — the same
 * "translation data exists but was never wired into the listing page" gap found on Guides). Each
 * card's name/summary is replaced with a real TH/ZH translation when one exists.
 */
export function TechnologyEntryGrid({ entries }: { entries: TechnologyEntry[] }) {
  const { locale } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {entries.map((entry) => {
        const overlay = locale === "th" ? TECHNOLOGY_COPY_TH[entry.id] : locale === "zh" ? TECHNOLOGY_COPY_ZH[entry.id] : undefined;
        return (
          <Link
            key={entry.id}
            href={`/technology/${entry.slug}`}
            className="group flex flex-col gap-3 rounded-2xl border border-surface-border-soft bg-surface-1 p-6 transition-colors hover:border-ember/40"
          >
            <h2 className="font-display text-xl font-semibold leading-tight text-foreground group-hover:text-ember">
              {locale === "th" && overlay?.name ? thaiTypography(overlay.name) : (overlay?.name ?? entry.name)}
            </h2>
            <p className="text-sm text-foreground-muted">{locale === "th" && overlay?.summary ? thaiTypography(overlay.summary) : (overlay?.summary ?? entry.summary)}</p>
          </Link>
        );
      })}
    </div>
  );
}
