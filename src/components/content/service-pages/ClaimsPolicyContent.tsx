"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { AgeNote, InfoCard, NumberedSteps, PendingFact, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";
import { CLAIMS } from "@/i18n/service-pages/claims-policy";

/** Body of the claims-policy DRAFT in the active language (copy: src/i18n/service-pages/claims-policy.tsx).
 *  The `draft` flag renders the DRAFT bar and the owner's open question (item 12); it is dropped
 *  when the page moves from /preview to /warranty. */
export function ClaimsPolicyContent({ draft }: { draft: boolean }) {
  const { locale } = useLocale();
  const c = CLAIMS[locale];
  return (
    <>
      {draft && (
        <div className="border-b border-unverified/30 bg-unverified/10">
          <Container className="flex flex-wrap items-center gap-3 py-3 text-sm text-unverified">
            <Badge tone="unverified">DRAFT</Badge>
            <span>{c.draftBar}</span>
          </Container>
        </div>
      )}
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
            {draft && (
              <PendingFact
                always
                question={{
                  th: "อาการแบบไหนที่รับเคลม และแบบไหนที่ไม่รับ — ขีดเลือกจากรายการด้านล่าง (ก รับ / ข ไม่รับ / ค แล้วแต่กรณี)",
                  en: "Which faults are covered and which are not — the owner ticks each line below (ก = covered / ข = not covered / ค = case by case)",
                  zh: "哪些故障受理、哪些不受理 —— 店主逐条勾选下方列表（ก = 受理 / ข = 不受理 / ค = 视情况而定）",
                }}
              />
            )}
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
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
