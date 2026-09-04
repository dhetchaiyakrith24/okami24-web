"use client";

import Link from "next/link";
import { Citrus, Snowflake, Cookie, Coffee, Leaf } from "lucide-react";
import type { FlavorFamily } from "@/types/catalog";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FLAVOR_COPY_TH, FLAVOR_COPY_ZH } from "@/i18n/flavor-copy";

const ICONS = {
  fruit: Citrus,
  "menthol-cooling": Snowflake,
  dessert: Cookie,
  beverage: Coffee,
  "tobacco-style": Leaf,
} as const;

/**
 * Moved out of `/e-liquid`'s Server Component page (owner quality review, 2026-09-02) so each
 * family's name/description can be replaced with a real TH/ZH translation from flavor-copy.ts —
 * the page itself can't read the real locale (see LocaleProvider's own architecture note).
 */
export function FlavorFamilyGrid({ families }: { families: FlavorFamily[] }) {
  const { locale } = useLocale();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {families.map((family) => {
        const Icon = ICONS[family.slug];
        const overlay = locale === "th" ? FLAVOR_COPY_TH[family.id] : locale === "zh" ? FLAVOR_COPY_ZH[family.id] : undefined;
        return (
          <Link
            key={family.id}
            href={`/e-liquid/${family.slug}`}
            className="group flex flex-col gap-4 rounded-2xl border border-surface-border-soft bg-surface-1 p-6 transition-colors hover:border-ember/40"
          >
            <Icon size={24} className="text-steel group-hover:text-ember" aria-hidden />
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">{overlay?.name ?? family.name}</h2>
              <p className="mt-2 text-sm text-foreground-muted">{overlay?.description ?? family.description}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
