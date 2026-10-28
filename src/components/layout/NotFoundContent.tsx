"use client";

import Image from "next/image";
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
    <Container className="flex flex-col items-center gap-6 pb-32 pt-12 text-center lg:pt-16">
      {/* Owner 29/10 "ไม่จำเป็นต้องตัดให้กลม ใช้เป็นภาพหลัก ค่อยๆไล่ Fade out": the whole character (moon, kabuto, hilt,
          sakura kimono) as the page's main picture — no oval cut; the sides fade early, the bottom fades long into the
          page (the top fades too, so no edge of the picture shows) and the "404" + heading sit on that faded part (the text starts where the picture is already dark). */}
      <div
        aria-hidden
        className="relative -mt-6 aspect-[1000/1017] w-[min(100%,420px)] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_42%,transparent_90%),linear-gradient(to_right,transparent,black_26%,black_74%,transparent)] lg:-mt-10 lg:w-[560px]"
      >
        <Image src="/brand/samurai-404-full.webp" alt="" fill priority sizes="(min-width: 1024px) 560px, 420px" className="object-cover" />
      </div>
      <span className="label-mono relative -mt-28 text-xs text-ember lg:-mt-40">404</span>
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
