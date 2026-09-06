"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AgeNote, SERVICE_PAGES_UPDATED, ServiceSection, SummaryCards, UpdatedAt } from "@/components/content/ServicePage";
import { PRIVACY } from "@/i18n/service-pages/privacy";

const LIST = "flex flex-col gap-1.5 text-sm";

/** Body of /privacy in the active language (copy: src/i18n/service-pages/privacy.tsx). */
export function PrivacyContent() {
  const { locale } = useLocale();
  const c = PRIVACY[locale];
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={c.description} meta={<UpdatedAt date={SERVICE_PAGES_UPDATED} />} />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <SummaryCards items={c.summary} />
          <p className="text-base leading-relaxed text-foreground-muted">{c.intro}</p>

          <ServiceSection title={c.s1.title}>
            <p>{c.s1.intro}</p>
            <ul className={LIST}>
              {c.s1.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p>{c.s1.outro}</p>
          </ServiceSection>

          <ServiceSection title={c.s2.title}>
            <ul className={LIST}>
              {c.s2.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
            <p>{c.s2.outro}</p>
          </ServiceSection>

          <ServiceSection title={c.s3.title}>
            <p>{c.s3.intro}</p>
            <ul className={LIST}>
              {c.s3.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p>{c.s3.outro}</p>
          </ServiceSection>

          <ServiceSection title={c.s4.title}>
            <ul className={LIST}>
              {c.s4.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
            <p>{c.s4.outro}</p>
          </ServiceSection>

          <ServiceSection title={c.s5.title}>
            <p>{c.s5.p1}</p>
            <p>{c.s5.p2}</p>
          </ServiceSection>

          <ServiceSection title={c.s6.title}>
            <p>{c.s6.intro}</p>
            <ul className={LIST}>
              {c.s6.rights.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p>{c.s6.how}</p>
            <ul className={LIST}>
              {c.s6.details.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </ServiceSection>

          <ServiceSection title={c.s7.title}>
            <p>{c.s7.body}</p>
          </ServiceSection>

          <ServiceSection title={c.s8.title}>
            <p>{c.s8.body}</p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
