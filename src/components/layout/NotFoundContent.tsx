"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CONTACT } from "@/data/contact";

/**
 * Round 30.3ข (owner, 2026-09-11): the 404 page in the visitor's language. Search engines index
 * this page too, and a Thai visitor who lands on a dead product link needs a way out they can
 * read. Three exits, in the order a lost visitor most likely wants them: keep shopping, ask a
 * person on LINE, go home. Nothing points at the cart — ordering is on LINE (item 43).
 * The mono "404" label stays as it was (THAI_STYLE §5 group ก — a label, not a sentence).
 */
export function NotFoundContent() {
  const { dict } = useLocale();
  const t = dict.notFound;
  return (
    <Container className="flex flex-col items-center gap-6 py-32 text-center">
      <span className="label-mono text-xs text-ember">404</span>
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t.title}</h1>
      <p className="max-w-md text-base text-foreground-muted">{t.body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button href="/products">{t.ctaProducts}</Button>
        <Button href={CONTACT.lineUrl} variant="secondary" external>
          {t.ctaLine}
        </Button>
        <Button href="/" variant="secondary">
          {t.ctaHome}
        </Button>
      </div>
    </Container>
  );
}
