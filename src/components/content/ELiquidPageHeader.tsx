"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ThaiText } from "@/components/i18n/ThaiText";
import { CONTACT } from "@/data/contact";

/** Same pattern as ComparePageHeader.tsx / FAQPageHeader.tsx. */
export function ELiquidPageHeader() {
  const { dict } = useLocale();
  return <PageHeader eyebrow={dict.eliquid.eyebrow} title={dict.eliquid.pageTitle} description={dict.eliquid.pageDescription} />;
}

/**
 * Round 8 B4 (owner ruling 2026-09-23, round-7 close item 3): the "salt nic กับ freebase" section —
 * five plain sentences, the "not sold on the storefront yet" line the owner wanted said outright,
 * and the LINE line. Same client-dictionary pattern as the header above; the LINE anchor is
 * counted by LineClickTracker like every other one (spot "other" — this is copy, not a button).
 */
export function ELiquidNicotineTypes() {
  const { dict } = useLocale();
  const t = dict.eliquid;
  return (
    <section className="mt-14 max-w-3xl" aria-labelledby="eliquid-nicotine-types">
      <h2 id="eliquid-nicotine-types" className="font-display text-[length:var(--text-h2)] font-semibold leading-[0.95] tracking-tight text-foreground">
        {t.nicTitle}
      </h2>
      <div className="mt-5 flex flex-col gap-3 text-base leading-relaxed text-foreground-muted">
        <p>
          {t.nicP1} {t.nicP2}
        </p>
        <p>
          {t.nicP3} {t.nicP4} {t.nicP5}
        </p>
        <p className="font-semibold text-foreground">{t.nicNotSold}</p>
        <p>
          <a href={CONTACT.lineUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground underline-offset-4 hover:text-red hover:underline">
            {t.nicCta}
          </a>
        </p>
      </div>
    </section>
  );
}

/** The compliance/scope disclaimer at the bottom of the e-liquid page — same hardcoded-English
 *  bug as the header above, fixed the same way. Kept in this file rather than a new one since
 *  it's a single paragraph tightly coupled to this one page. */
export function ELiquidDisclaimer() {
  const { dict } = useLocale();
  return (
    <div className="mt-14 rounded-2xl border border-surface-border-soft bg-surface-1 p-6">
      <p className="text-sm leading-relaxed text-foreground-muted"><ThaiText>{dict.eliquid.disclaimer}</ThaiText></p>
    </div>
  );
}
