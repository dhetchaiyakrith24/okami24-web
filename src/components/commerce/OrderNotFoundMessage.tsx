"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function OrderNotFoundMessage() {
  const { dict } = useLocale();
  return (
    <>
      <PageHeader eyebrow={dict.orderStatus.eyebrow} title={dict.orderStatus.pageTitle} />
      <Container className="py-12 lg:py-16">
        <p className="text-foreground-muted">{dict.orderStatus.notFoundMessage}</p>
      </Container>
    </>
  );
}
