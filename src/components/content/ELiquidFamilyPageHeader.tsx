"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { FLAVOR_COPY_TH, FLAVOR_COPY_ZH } from "@/i18n/flavor-copy";
import { keepTogether } from "@/lib/thai-keep-together";

/**
 * Same pattern as ELiquidPageHeader.tsx for the eyebrow. Content-level i18n fix (owner quality
 * review, 2026-09-02): `id` looks up a real TH/ZH translation of this family's own name/
 * description in flavor-copy.ts, replacing the English `title`/`description` props when one
 * exists for the active locale.
 */
export function ELiquidFamilyPageHeader({ id, title, description }: { id: string; title: string; description: string }) {
  const { dict, locale } = useLocale();
  const overlay = locale === "th" ? FLAVOR_COPY_TH[id] : locale === "zh" ? FLAVOR_COPY_ZH[id] : undefined;
  // Round 30.4 Q1: the beverage lede keeps "เบเกอรี่" on one line at render time only (see
  // src/lib/thai-keep-together.ts) — generateMetadata in the page reads the plain string.
  return <PageHeader eyebrow={dict.eliquid.familyEyebrow} title={overlay?.name ?? title} description={keepTogether(overlay?.description ?? description, `flavor:${id}:description`)} />;
}

export function ELiquidCharacterNotesTitle() {
  const { dict } = useLocale();
  return <h2 className="font-display text-xl font-semibold text-foreground">{dict.eliquid.characterNotesTitle}</h2>;
}

/** Content-level i18n fix (owner quality review, 2026-09-02) — moved out of the Server Component
 *  page (which can't read the real locale) so the character-note bullets can be replaced with a
 *  real TH/ZH translation, same rule as the header above. */
export function ELiquidCharacterNotesList({ id, notes }: { id: string; notes: string[] }) {
  const { locale } = useLocale();
  const overlay = locale === "th" ? FLAVOR_COPY_TH[id] : locale === "zh" ? FLAVOR_COPY_ZH[id] : undefined;
  const activeNotes = overlay?.characterNotes ?? notes;
  return (
    <ul className="mt-4 flex flex-col gap-3">
      {activeNotes.map((note, i) => (
        <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground-muted">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-steel" aria-hidden />
          {note}
        </li>
      ))}
    </ul>
  );
}

export function ELiquidFamilyDisclaimer() {
  const { dict } = useLocale();
  return <p className="mt-10 text-xs leading-relaxed text-foreground-dim">{dict.eliquid.familyDisclaimer}</p>;
}
