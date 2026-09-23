"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { getImageProps } from "next/image";
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

export function Hero({
  flagship,
  backdrop,
  productCount,
  brandCount,
}: {
  flagship: Product;
  backdrop?: Product;
  /** Counted in page.tsx from the same sources /products counts — never hardcoded here again. */
  productCount: number;
  brandCount: number;
}) {
  const { dict } = useLocale();
  const backdropRef = useRef<HTMLDivElement>(null);

  // M1b: the phone's hero has a slow, permanent background layer (see `okami-hero-bg-*` in
  // globals.css). "Permanent" only while it is on screen — an animation that keeps running under
  // a page the visitor has scrolled past is battery spent on nothing, so the layer is observed and
  // genuinely paused, not merely faded. The attribute drives both halves in CSS: opacity for the
  // fade, `animation-play-state: paused` for the stop. Desktop never runs this — the layer is
  // `lg:hidden`, so `backdropRef.current` still exists but its own media query leaves it inert,
  // and the observer costs one callback per scroll past the hero.
  useEffect(() => {
    const layer = backdropRef.current;
    const section = layer?.parentElement;
    if (!layer || !section || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        layer.dataset.visible = entry.isIntersecting ? "1" : "0";
      },
      { threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // The one product photo that appears behind everything, blurred almost to nothing. Falls back to
  // no ghost at all if the product has no isolated card shot — the light and dust layers stand on
  // their own, and an un-isolated photo would read as a rectangle, not a device.
  //
  // 96px wide, and that number is doing real work. Chrome sizes an LCP candidate by the SMALLER of
  // its intrinsic and displayed size, so asking for a deliberately tiny file keeps this decorative
  // layer well under the hero photo's ~36k px² and out of the running: measured at 390px, a
  // full-size background made `.okami-hero-bg-ghost` the LCP element, which is not what the page's
  // largest paint should be. It is also 7px-blurred at 18% opacity behind everything, so 96px is
  // all the detail that can possibly survive — and it costs ~4KB instead of ~55KB.
  const ghost = backdrop?.assets.find((a) => a.role === "card");
  const ghostSrc = ghost
    ? getImageProps({ src: ghost.src, alt: "", width: 96, height: 192, quality: 75 }).props.src
    : null;

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
      {/* M1b (owner picked option "ค" from three rendered mockups, 2026-09-09). Round M1's hero
          motion was an intro: it played for 0.78s and then the phone sat perfectly still, which the
          owner read on a real device as "the motion is gone, there's nothing there". This layer is
          the opposite — it never stops while the hero is on screen, and it is slow enough (10-15s
          periods, 12px of travel end to end) that it reads as depth rather than as something moving.

          Four layers, all of them BEHIND every existing one because this is the section's first
          child: a second device from the catalogue, blurred and dimmed to 18%; one ember cloud
          drifting along the bottom; a wide band of light crossing every 12s; and ten specks of
          dust. Only `transform`/`opacity` animate, everything is `position: absolute`, so there is
          no layout to shift and CLS stays 0 by construction.

          `lg:hidden` is what protects the desktop: at >=64rem the whole layer is display:none, so
          the desktop hero — including the cinematic intro above it — is byte-for-byte unchanged. */}
      <div
        ref={backdropRef}
        aria-hidden
        className="okami-hero-bg pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
      >
        {/* The ghost is a CSS background, not an <img>, and that is a deliberate choice made after
            measuring. With an `<img>` here the 1440px proof came back 0.094% different every single
            run: the extra element changed the order the browser worked through the page's lazy
            images, and one product card downstream ended up decoded in time for the screenshot when
            it previously was not. Nothing had MOVED — but "desktop does not change" has to mean the
            pixels, so the image moved into CSS, where a `display: none` ancestor means the file is
            never requested at all. The path still comes from the catalogue rather than being
            written into the stylesheet: `getImageProps` builds the URL the same way `<Image>` would,
            so the optimiser still serves it — but at 96px, which is a few KB to encode rather than
            a full card photo, and one stable URL the edge can keep for the full 30 days. */}
        {ghostSrc ? (
          <div
            className="okami-hero-bg-ghost"
            style={{ "--okami-hero-ghost": `url(${ghostSrc})` } as CSSProperties}
          />
        ) : null}
        <div className="okami-hero-bg-blob" />
        <div className="okami-hero-bg-sweep" />
        <div className="okami-hero-bg-dust">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} />
          ))}
        </div>
      </div>
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
            {/* Round 8 B1 (designer #1, 2026-09-23): line 1 is Latin now ("Pod System"), and at the
                h1's 0.92 leading its "y" descender sat on the Thai tone marks of line 2. A larger
                line-height on this span alone grows its line box on desktop (inline) and phone
                (inline-block) alike — ~0.1em of air under "Pod System" — while the Thai-on-Thai
                gap between lines 2 and 3, which was always fine, does not move. */}
            <span className="okami-hero-line-1 leading-[1.12]">{dict.hero.headingLine1}</span>
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
            <StatBlock label={dict.hero.statProducts} value={String(productCount)} />
            <StatBlock label={dict.hero.statBrands} value={String(brandCount)} />
            <StatBlock label={dict.hero.statFamilies} value="8" />
          </dl>
        </div>

        <div className="okami-hero-media relative mx-auto aspect-[4/5] w-full max-w-sm">
          {/* The three class hooks below (frame / pad / name bar) exist only so the phone rules in
              globals.css can address these boxes by name instead of by child position — M1.2
              re-proportions all three, and a positional selector would break silently the next
              time anything is added here. They carry no styling of their own at any width. */}
          <div className="okami-hero-frame absolute inset-0 rounded-[2rem] border border-surface-border bg-surface-1/60 backdrop-blur-sm" />
          <div className="okami-hero-pad relative h-full w-full p-10">
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
            className="okami-hero-namebar absolute inset-x-4 bottom-4 flex items-center justify-between rounded-xl border border-surface-border bg-surface-0/90 px-4 py-3 backdrop-blur transition-colors hover:border-ember/50"
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
