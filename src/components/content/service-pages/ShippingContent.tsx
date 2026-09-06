"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AgeNote, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";
import { SHIPPING } from "@/i18n/service-pages/shipping";

/** Body of /shipping in the active language (copy: src/i18n/service-pages/shipping.tsx). */
export function ShippingContent() {
  const { locale } = useLocale();
  const c = SHIPPING[locale];
  const link = "text-foreground hover:text-red";
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={c.description} meta={<SummaryCards items={c.summary} />} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <ServiceSection title={c.feeTitle}>
            <div className="overflow-x-auto rounded-xl border border-surface-border-soft bg-surface-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="label-mono text-xs text-foreground-dim">
                    <th className="px-4 py-3 text-left font-normal">{c.tableHeadTotal}</th>
                    <th className="px-4 py-3 text-left font-normal">{c.tableHeadFee}</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  <tr className="border-t border-surface-border-soft">
                    <td className="px-4 py-3">{c.rowUnder}</td>
                    <td className="px-4 py-3 font-semibold">{c.rowUnderFee}</td>
                  </tr>
                  <tr className="border-t border-surface-border-soft">
                    <td className="px-4 py-3">{c.rowOver}</td>
                    <td className="px-4 py-3 font-semibold text-verified">{c.rowOverFee}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>{c.feeNote}</p>
          </ServiceSection>

          <ServiceSection title={c.whenTitle}>
            <p>{c.when1}</p>
            <p>{c.when2}</p>
            <p>{c.when3}</p>
            <p>{c.when4}</p>
          </ServiceSection>

          <ServiceSection title={c.trackTitle}>
            <p>{c.track1}</p>
            <p>{c.track2}</p>
            <p>{c.track3}</p>
          </ServiceSection>

          <ServiceSection title={c.intlTitle}>
            <p>{c.intl}</p>
          </ServiceSection>

          <ServiceSection title={c.problemTitle}>
            <p>{c.problem}</p>
            <p className="text-sm">
              {c.readNext} <Link href="/warranty" className={link}>{c.links.warranty}</Link> · <Link href="/how-to-order" className={link}>{c.links.howToOrder}</Link> ·{" "}
              <Link href="/contact" className={link}>{c.links.contact}</Link>
            </p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
