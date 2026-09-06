"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AgeNote, InfoCard, NumberedSteps, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";
import { CLAIMS } from "@/i18n/service-pages/claims-policy";

/**
 * Body of /warranty in the active language (copy: src/i18n/service-pages/claims-policy.tsx).
 * Published 2026-09-06 after the owner ticked the symptom list (BSOT §12) — the DRAFT bar and
 * the "owner to confirm" box that lived here while it was a /preview draft are gone.
 */
export function ClaimsPolicyContent() {
  const { locale } = useLocale();
  const c = CLAIMS[locale];
  const link = "text-foreground hover:text-red";
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <SummaryCards items={c.summary} />

          <ServiceSection title={c.window.title}>
            <p>{c.window.body}</p>
          </ServiceSection>

          <ServiceSection title={c.video.title}>
            <p>{c.video.p1}</p>
            <p>{c.video.p2}</p>
          </ServiceSection>

          <ServiceSection title={c.symptoms.title}>
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard title={c.symptoms.acceptTitle}>
                {c.symptoms.acceptItems.map((it) => (
                  <p key={it}>{it}</p>
                ))}
              </InfoCard>
              <InfoCard title={c.symptoms.declineTitle}>
                {c.symptoms.declineItems.map((it) => (
                  <p key={it}>{it}</p>
                ))}
              </InfoCard>
            </div>
            <p>{c.symptoms.caseByCase}</p>
          </ServiceSection>

          <ServiceSection title={c.outcome.title}>
            <p>{c.outcome.p1}</p>
            <p>{c.outcome.p2}</p>
            <p>{c.outcome.p3}</p>
          </ServiceSection>

          <ServiceSection title={c.steps.title}>
            <NumberedSteps steps={c.steps.items} />
          </ServiceSection>

          <ServiceSection title={c.honest.title}>
            <p>{c.honest.p1}</p>
            <p>{c.honest.p2}</p>
            <p>{c.honest.p3}</p>
            <p className="text-sm">
              {c.readNext} <Link href="/how-to-order" className={link}>{c.links.howToOrder}</Link> · <Link href="/shipping" className={link}>{c.links.shipping}</Link> ·{" "}
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
