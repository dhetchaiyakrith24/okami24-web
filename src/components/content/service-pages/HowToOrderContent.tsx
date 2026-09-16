"use client";

import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AgeNote, NumberedSteps, PhaseLabel, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt, useServiceCopy } from "@/components/content/ServicePage";
import { HOW_TO_ORDER } from "@/i18n/service-pages/how-to-order";

/** Body of /how-to-order in the active language (copy: src/i18n/service-pages/how-to-order.tsx).
 *  Layout unchanged from the Thai-only version (designer direction A, 2026-09-06). */
export function HowToOrderContent({ orderingEnabled = true }: { orderingEnabled?: boolean } = {}) {
  const c = useServiceCopy(HOW_TO_ORDER);
  const link = "text-foreground hover:text-red";
  return (
    <>
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        description={orderingEnabled ? c.description : c.descriptionWhileOrderingOnLine}
        meta={
          <div className="flex flex-wrap gap-3">
            <Button href="/products">{c.browseCta}</Button>
            <Button href={CONTACT.lineUrl} external variant="secondary">
              {c.askLineCta}
            </Button>
          </div>
        }
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          {/* The sentence under the page title already says ordering is on LINE, but it is a
              screen above this and the block below names buttons that are not on the site right
              now ("Add to cart", "Go to checkout"). Ember border, no heading: it has to read as a
              note on the steps, not compete with the three summary cards under it. */}
          {!orderingEnabled && (
            <p role="note" className="rounded-xl border border-ember/25 bg-surface-1 px-4 py-3 text-sm leading-relaxed text-foreground">
              <strong className="font-semibold">{c.stepsPausedLead}</strong> {c.stepsPausedNotice}
            </p>
          )}
          <SummaryCards items={c.summary} />

          <ServiceSection title={c.stepsTitle}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <PhaseLabel>{c.phase1}</PhaseLabel>
                <NumberedSteps start={1} steps={c.orderSteps} />
              </div>
              <div className="flex flex-col gap-4">
                <PhaseLabel>{c.phase2}</PhaseLabel>
                <NumberedSteps start={c.orderSteps.length + 1} steps={c.paySteps} />
              </div>
              <div className="flex flex-col gap-4">
                <PhaseLabel>{c.phase3}</PhaseLabel>
                <p className="text-sm leading-relaxed">{c.receiveBody}</p>
              </div>
            </div>
          </ServiceSection>

          <ServiceSection title={c.afterTitle}>
            <p>{c.afterIntro}</p>
            <ul className="flex flex-col gap-2 text-sm">
              {c.statuses.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
            <p>{c.cancelStatus}</p>
            <p>{c.cancelBefore}</p>
            <p>{c.noRefund}</p>
          </ServiceSection>

          <ServiceSection title={c.checkTitle}>
            <ul className="flex flex-col gap-2 text-sm">
              {c.checks.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </ServiceSection>

          <ServiceSection title={c.stuckTitle}>
            <p>{c.stuck1}</p>
            <p>{c.stuck2}</p>
            <p>{c.stuck3}</p>
            <p className="text-sm">
              {c.readNext} <Link href="/shipping" className={link}>{c.links.shipping}</Link> · <Link href="/contact" className={link}>{c.links.contact}</Link> ·{" "}
              <Link href="/faq" className={link}>{c.links.faq}</Link>
            </p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
