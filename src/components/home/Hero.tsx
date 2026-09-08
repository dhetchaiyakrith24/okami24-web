"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types/catalog";
import { ProductMedia } from "@/components/visual/ProductMedia";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { brandName, formatBattery, formatWattage } from "@/lib/utils";
import { useLocale } from "@/components/i18n/LocaleProvider";

/** How long the phone's hero motion runs, end to end (see globals.css, `okami-hero-*`). The spec's
 *  ceiling is 0.8s; the last keyframe finishes at 0.78s and this leaves a small margin on top. */
const HERO_MOTION_MS = 900;

export function Hero({ flagship }: { flagship: Product }) {
  const { dict } = useLocale();

  // MOBILE_SPEC [M1] "plays once, never again on back". Once the motion has finished, mark the
  // document so the CSS stops arming it: the attribute lives on <html>, which survives every
  // client-side navigation, so returning to the homepage with the back button re-renders a Hero
  // that simply has no animation to play. The sessionStorage twin covers a reload — read back by
  // the inline script in page.tsx before the first frame is painted. Desktop runs this too and is
  // unaffected: no desktop rule ever reads the attribute.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      document.documentElement.dataset.okamiIntro = "played";
      try {
        sessionStorage.setItem("okami24-home-intro", "1");
      } catch {
        // Private-mode Safari throws on write; the attribute above still covers this session.
      }
    }, HERO_MOTION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-surface-border-soft bg-surface-0">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 78% 20%, var(--color-ember-soft) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 90%, var(--color-steel-soft) 0%, transparent 55%)",
        }}
        aria-hidden
      />
      <Container className="relative grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-24">
        <div className="flex flex-col gap-7">
          <span className="label-mono inline-flex w-fit items-center gap-2 rounded-full border border-surface-border bg-surface-1 px-3 py-1.5 text-[0.65rem] text-foreground-muted">
            {brandName(flagship.brandId)} {dict.hero.badgeSuffix}
          </span>
          <h1 className="font-display text-[length:var(--text-display)] font-bold leading-[0.92] tracking-tight text-foreground">
            {/* MOBILE_SPEC [M1]: on a phone the three Thai lines rise one after another, so each
                needs to be its own animatable box. The spans carry no styling of their own and
                stay `display: inline` at every width — only the phone-width rules in globals.css
                promote them to inline-block — so the desktop line boxes are byte-for-byte what
                they were. The text nodes and the <br /> between them are untouched on purpose
                (a reshaped text node has moved desktop type by 30px on this site before). */}
            <span className="okami-hero-line-1">{dict.hero.headingLine1}</span>
            <br />
            <span className="okami-hero-line-2">{dict.hero.headingLine2}</span>
            <br />
            <span className="okami-hero-line-3 text-ember">{dict.hero.headingAccent}</span>
          </h1>
          <p className="max-w-md text-base leading-relaxed text-foreground-muted sm:text-lg">{dict.hero.description}</p>
          <div className="okami-hero-cta flex flex-wrap gap-3 pt-2">
            <Button href="/products">{dict.hero.ctaPrimary}</Button>
            <Button href="/finder" variant="secondary">
              {dict.hero.ctaSecondary}
            </Button>
          </div>
          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 border-t border-surface-border-soft pt-6">
            <StatBlock label={dict.hero.statProducts} value="28" />
            <StatBlock label={dict.hero.statBrands} value="3" />
            <StatBlock label={dict.hero.statFamilies} value="8" />
          </dl>
        </div>

        <div className="okami-hero-media relative mx-auto aspect-[4/5] w-full max-w-sm">
          <div className="absolute inset-0 rounded-[2rem] border border-surface-border bg-surface-1/60 backdrop-blur-sm" />
          <div className="relative h-full w-full p-10">
            {/* MOBILE_SPEC [M1]: the phone's hero photo is the page's largest paint, so it must
                not be lazy. `priority` is deprecated in Next 16 and measurably does nothing (see
                ProductMedia), so this asks for the two attributes that still work. Deliberately
                NOT `preload`: that injects a <link rel="preload"> into every visitor's <head>,
                and on desktop this photo sits under a 600vh intro where preloading it would just
                compete with the intro's own images. `loading="eager"` + `fetchPriority="high"`
                cost nothing there and are exactly what the phone needs. `sizes` below 1024px goes
                from 60vw to 70vw to match what the box really measures on a 390px phone (270px);
                the >=1024px half is untouched, so desktop requests the same file as before. */}
            <ProductMedia
              product={flagship}
              sizes="(min-width: 1024px) 25vw, 70vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          {/* MOBILE_SPEC [M1] "a light travels across the device, once". Phone/tablet only — at lg
              this whole layer is `display: none`, so the desktop card is untouched. */}
          <div
            aria-hidden
            className="okami-hero-sheen pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] lg:hidden"
          >
            <div className="okami-hero-sheen-bar absolute inset-y-0 w-1/2" />
          </div>
          <Link
            href={`/products/${flagship.slug}`}
            className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-surface-border bg-surface-0/90 px-4 py-3 backdrop-blur transition-colors hover:border-ember/50"
          >
            <div>
              <p className="font-display text-lg font-semibold leading-tight text-foreground">{flagship.name}</p>
              <p className="label-mono text-[0.65rem] text-foreground-dim">
                {formatBattery(flagship.attributes.batteryMah)} · {formatWattage(flagship.attributes.wattageMin, flagship.attributes.wattageMax)}
              </p>
            </div>
            <span className="label-mono text-xs text-ember">{dict.hero.viewProduct}</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-display text-2xl font-semibold text-foreground">{value}</span>
      <span className="label-mono text-[0.6rem] text-foreground-dim">{label}</span>
    </div>
  );
}
