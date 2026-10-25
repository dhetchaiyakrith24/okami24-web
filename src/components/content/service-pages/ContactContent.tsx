"use client";

import Link from "next/link";
import { CONTACT } from "@/data/contact";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AgeNote, EmailLink, InfoCard, LineLink, SERVICE_PAGES_UPDATED, ServiceSection, UpdatedAt, useServiceCopy } from "@/components/content/ServicePage";
import { CONTACT_PAGE } from "@/i18n/service-pages/contact";

/** Body of /contact in the active language (copy: src/i18n/service-pages/contact.tsx). */
export function ContactContent({ orderingEnabled = true }: { orderingEnabled?: boolean } = {}) {
  const c = useServiceCopy(CONTACT_PAGE);
  return (
    <>
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
        meta={
          <div className="flex flex-wrap gap-3">
            <Button href={CONTACT.lineUrl} external className="w-full sm:w-auto">
              {c.lineCta}
            </Button>
            <Button href={CONTACT.youtubeUrl} external variant="secondary" className="w-full sm:w-auto">
              {c.youtubeCta}
            </Button>
          </div>
        }
      />
      <Container className="max-w-2xl py-12 lg:py-16">
        <div className="flex flex-col gap-10">
          <ServiceSection title={c.channelsTitle}>
            <div className="flex flex-col gap-3">
              <InfoCard title={c.lineCardTitle}>
                <p>{c.lineCard1}</p>
                <p>
                  <LineLink>{CONTACT.lineUrl}</LineLink>
                </p>
                <p>{c.lineCardHours}</p>
              </InfoCard>
              <InfoCard title={c.emailCardTitle}>
                <p>{c.emailCard1}</p>
                <p>
                  <EmailLink />
                </p>
                <p>{c.emailCard2}</p>
              </InfoCard>
              <InfoCard title={c.youtubeCardTitle}>
                <p>{c.youtubeCard1}</p>
                <p>
                  <a href={CONTACT.youtubeUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:text-red">
                    {CONTACT.youtubeUrl}
                  </a>
                </p>
              </InfoCard>
              {/* Q7b (26/10): the card follows the OKAMI24_ORDERING switch — cart on = order on the site, off = order on LINE. */}
              <InfoCard title={orderingEnabled ? c.orderCardTitleWhileOrderingOn : c.orderCardTitle}>
                <p>{orderingEnabled ? c.orderCard1WhileOrderingOn : c.orderCard1}</p>
                <p>{orderingEnabled ? c.orderCard2WhileOrderingOn : c.orderCard2}</p>
                <p>
                  <Link href="/how-to-order" className="font-semibold text-foreground hover:text-red">
                    {c.orderCardLink}
                  </Link>
                </p>
              </InfoCard>
            </div>
          </ServiceSection>

          <ServiceSection title={c.prepareTitle}>
            <p>{c.prepareIntro}</p>
            <ul className="flex flex-col gap-2 text-sm">
              {c.prepareItems.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <p>{c.prepareOutro}</p>
          </ServiceSection>

          <ServiceSection title={c.sellerTitle}>
            <p>
              {c.seller.shop} · {c.seller.officialLabel} <EmailLink /> · {c.seller.quickLabel} <LineLink />
            </p>
          </ServiceSection>

          <AgeNote />
          <UpdatedAt date={SERVICE_PAGES_UPDATED} />
        </div>
      </Container>
    </>
  );
}
