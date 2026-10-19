"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { HeroRibbons } from "@/lib/hero-ribbons";
import type { HeroType } from "@/data/home-hero";

/** One slot as page.tsx resolved it from the catalog — the client never sees the catalog itself
 *  (LESSONS 37: a client component that imports the whole-shop tables ships them to every phone). */
export type HeroSlotView = {
  type: HeroType;
  categoryHref: string;
  productHref: string;
  name: string;
  brand: string;
  image: { src: string; alt: string };
};

/** The English tag above each tab's label — an English eyebrow by design (THAI_STYLE §5 group ก). */
const TYPE_TAG: Record<HeroType, string> = {
  "pod-systems": "Pod System",
  "switch-pods": "Switch Pod",
  disposables: "Disposable",
  "heated-tobacco-devices": "Heated Tobacco",
};

/**
 * The homepage hero (round "หน้าแรก hero", owner 20/10 — the draft he approved is
 * `_incoming/hero-draft/`). Dark, calm, the product is the hero; it rotates by TYPE (one product
 * each, data in src/data/home-hero.ts) and orange ribbons drawn in code carry each change.
 *
 * Everything that must be right in the first painted frame is server HTML: slot 0 is already
 * "on", its photo is eager + high priority (the phone's LCP), the progress bar is a CSS animation.
 * JavaScript only adds the ribbons and the rotation. The rotation itself is that CSS animation:
 * when the bar of the active tab finishes, `animationend` moves to the next slot — no per-frame
 * React work. A tap on a tab stops the auto-rotation for good (the visitor took over); hovering
 * the product pauses it; off-screen or a hidden tab pauses the bar and stops the ribbon loop.
 * Reduced motion and Save-Data (`html[data-okami-lite]`, set in page.tsx) get one still ribbon
 * frame and no auto-rotation (globals.css removes the bar animation).
 */
export function HeroShowcase({ slots }: { slots: HeroSlotView[] }) {
  const { dict, locale } = useLocale();
  const copy = dict.heroShowcase;
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ribbonsRef = useRef<HeroRibbons | null>(null);
  const tx = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);

  const curRef = useRef(0);
  const go = useCallback((i: number) => {
    const c = curRef.current;
    if (c === i) return;
    curRef.current = i;
    setPrev(c);
    setCur(i);
    ribbonsRef.current?.surge();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!section || !canvas || !stage) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";
    // no setAuto here: under reduced motion / Save-Data globals.css removes the bar animation, so
    // animationend never fires and nothing rotates by itself

    // the bundle crosses behind the product: its centre, measured on resize only
    let focus = { x: 0, y: 0 };
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      focus = { x: s.left - c.left + s.width / 2, y: s.top - c.top + s.height / 2 };
    };
    measure();
    const ribbons = HeroRibbons.create(canvas, () => focus);
    // null = no WebGL: the hero works without its ribbons (rotation and pausing still run)
    ribbonsRef.current = ribbons;

    let visible = true;
    const run = () => {
      if (!ribbons) return;
      if (still) ribbons.still();
      else if (visible && !document.hidden) ribbons.start();
      else ribbons.stop();
    };
    const ro = new ResizeObserver(() => {
      measure();
      ribbons?.resize();
      run();
    });
    ro.observe(section);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      setOnScreen(visible);
      run();
    });
    io.observe(section);
    document.addEventListener("visibilitychange", run);
    run();
    return () => {
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
      ribbons?.destroy();
      ribbonsRef.current = null;
    };
  }, []);

  const paused = hover || !onScreen;
  const slot = slots[cur];

  return (
    <section ref={sectionRef} className="okh relative isolate overflow-hidden border-b border-surface-border-soft bg-surface-0">
      <canvas ref={canvasRef} aria-hidden className="okh-canvas" />

      <div className="okh-grid mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="okh-copy">
          <h1 className="font-display font-semibold text-foreground">
            <span className="okh-kicker label-mono">
              <i aria-hidden />
              {copy.kicker}
            </span>
            <span className="okh-h1">
              {tx(copy.headingLine1)}
              <br />
              <span className="text-ember">{tx(copy.headingAccent)}</span>
            </span>
          </h1>
          <p className="okh-lede">
            {tx(copy.lede1)} <span className="whitespace-nowrap">{tx(copy.lede2)}</span>
          </p>
        </div>

        <div className="okh-cta">
          <Link href="/finder" className="okh-btn okh-btn-primary">
            {tx(copy.ctaFinder)}
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <Link href="/products" className="okh-btn okh-btn-ghost">
            {tx(copy.ctaAll)}
          </Link>
        </div>

        <div
          ref={stageRef}
          className="okh-stage"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="okh-floor" aria-hidden />
          {slots.map((s, i) => {
            const mask = getImageProps({ src: s.image.src, alt: "", width: 480, height: 600, quality: 60 }).props.src;
            return (
              <Link
                key={s.type}
                href={s.categoryHref}
                className="okh-prod"
                data-state={i === cur ? "on" : i === prev ? "out" : undefined}
                aria-hidden={i !== cur}
                tabIndex={i === cur ? 0 : -1}
              >
                <span className="okh-float">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes="(min-width: 1024px) 40vw, 70vw"
                    className="object-contain"
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                  />
                  <span className="okh-sheen" style={{ "--okh-mask": `url(${mask})` } as CSSProperties} aria-hidden />
                </span>
              </Link>
            );
          })}
          <div key={cur} className="okh-meta">
            <span className="okh-idx label-mono" lang="en">
              {String(cur + 1).padStart(2, "0")} / {String(slots.length).padStart(2, "0")}
            </span>
            <Link href={slot.productHref} className="okh-name font-display">
              {slot.name}
            </Link>
            <span className="okh-brand label-mono" lang="en">
              {slot.brand}
            </span>
            <Link href={slot.categoryHref} className="okh-go">
              {tx(copy.viewCategory)} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="okh-tabs" role="group" aria-label={copy.tabsLabel} data-paused={paused ? "1" : undefined}>
          {slots.map((s, i) => (
            <button
              key={s.type}
              type="button"
              className="okh-tab"
              aria-pressed={i === cur}
              onClick={() => {
                setAuto(false);
                go(i);
              }}
            >
              <span
                key={`${cur}-${auto}`}
                className="okh-bar"
                data-run={i === cur && auto ? "1" : undefined}
                data-full={i === cur && !auto ? "1" : undefined}
                onAnimationEnd={() => {
                  if (i === cur && auto) go((cur + 1) % slots.length);
                }}
              />
              <span className="okh-n label-mono" lang="en">
                {String(i + 1).padStart(2, "0")}
                {locale === "en" ? null : <em> · {TYPE_TAG[s.type]}</em>}
              </span>
              <span className="okh-t">{tx(copy.types[s.type].label)}</span>
              <span className="okh-d">{tx(copy.types[s.type].desc)}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
