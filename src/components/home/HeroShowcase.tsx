"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { mainThreadDriver, type RibbonDriver } from "@/lib/hero-ribbons";
import { workerDriver } from "./ribbon-driver";
import { fxIsOff, markFx, onFxChange, setFxOff } from "@/lib/fx-pref";
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
 * The light switch in the stage's corner (owner 20/10, lib/fx-pref.ts) turns the hero's and the flow
 * layer's ribbons off for this browser: off at load = they never start; flipped = they stop and fade.
 */
export function HeroShowcase({ slots }: { slots: HeroSlotView[] }) {
  const { dict, locale } = useLocale();
  const copy = dict.heroShowcase;
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [auto, setAuto] = useState(true);
  const [hover, setHover] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  // the other three photos are requested only once the page has loaded (or the hero moves on):
  // in viewport, a lazy image loads at once and the four competed with the first one (phone LCP)
  const [warm, setWarm] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ribbonsRef = useRef<RibbonDriver | null>(null);
  const fxOff = useSyncExternalStore(onFxChange, fxIsOff, () => false);
  const tx = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);

  const curRef = useRef(0);
  const go = useCallback((i: number) => {
    const c = curRef.current;
    if (c === i) return;
    curRef.current = i;
    setPrev(c);
    setCur(i);
    setWarm(true);
    ribbonsRef.current?.surge();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.okamiLite === "1";
    // no setAuto here: under reduced motion / Save-Data globals.css removes the bar animation, so
    // animationend never fires and nothing rotates by itself

    // A fresh canvas per mount: an OffscreenCanvas transfer can happen only once per element.
    const canvas = document.createElement("canvas");
    canvas.className = "okh-canvas";
    canvas.setAttribute("aria-hidden", "true");
    section.prepend(canvas);

    let ribbons: RibbonDriver | null = null;
    let visible = true;
    let disposed = false;
    let off = fxIsOff();
    markFx(off);
    let loaded = false;
    let started = false;
    // scroll is sent relative to the hero itself: on desktop the cinematic intro (DESKTOP_INTRO) puts
    // the hero ~5 screens down, and the page's own scrollY dimmed the ribbons there (checker #634)
    let heroTop = 0;
    const sync = () => {
      if (!ribbons) return;
      const c = canvas.getBoundingClientRect();
      const s = stage.getBoundingClientRect();
      // the bundle crosses behind the product: its centre, in canvas pixels
      ribbons.size(c.width, c.height, Math.min(window.devicePixelRatio || 1, 2), window.innerWidth < 1024);
      ribbons.focus(s.left - c.left + s.width / 2, s.top - c.top + s.height / 2);
      heroTop = section.getBoundingClientRect().top + window.scrollY;
      ribbons.scroll(window.scrollY - heroTop);
    };
    const run = () => ribbons?.run(visible && !document.hidden && !off, still && !off);
    const onScroll = () => ribbons?.scroll(window.scrollY - heroTop);

    // The ribbons wait until the page has loaded and the browser is idle: the product photo and the
    // headline paint first, then the light fades in (globals.css, [data-on]). Measured 20/10: starting
    // them during load cost the phone LCP ~1.3 s in Lighthouse. They run in a worker when the browser
    // can (OffscreenCanvas): a main-thread loop made the page re-tick every other animation each frame.
    const start = () => {
      if (disposed || started || off) return;
      started = true;
      const viaWorker = workerDriver([canvas], () => {
        if (!disposed) canvas.dataset.on = "1";
      });
      ribbons = viaWorker ?? mainThreadDriver(canvas);
      // null = no WebGL: the hero works without its ribbons (rotation and pausing still run)
      ribbonsRef.current = ribbons;
      if (!ribbons) return;
      if (!viaWorker) canvas.dataset.on = "1";
      sync();
      run();
      window.addEventListener("scroll", onScroll, { passive: true });
    };
    const begin = () => {
      if (disposed) return;
      setWarm(true);
      loaded = true;
      start();
    };
    const unFx = onFxChange((o) => {
      off = o;
      if (loaded) start();
      run();
    });
    const idle = () =>
      typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(begin, { timeout: 1500 }) : setTimeout(begin, 300);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });

    const ro = new ResizeObserver(() => {
      sync();
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
    return () => {
      disposed = true;
      window.removeEventListener("load", idle);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", run);
      unFx();
      ribbons?.destroy();
      ribbonsRef.current = null;
      canvas.remove();
    };
  }, []);

  const paused = hover || !onScreen;
  const slot = slots[cur];

  return (
    <section ref={sectionRef} className="okh relative isolate overflow-hidden border-b border-surface-border-soft bg-surface-0">
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
          <button type="button" className="okh-fx" data-off={fxOff ? "1" : undefined} onClick={() => setFxOff(!fxOff)}>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
              <path d="M8 1.5v2.2M8 12.3v2.2M1.5 8h2.2M12.3 8h2.2M3.4 3.4l1.5 1.5M11.1 11.1l1.5 1.5M3.4 12.6l1.5-1.5M11.1 4.9l1.5-1.5" />
              <circle cx="8" cy="8" r="2.3" />
            </svg>
            {fxOff ? copy.fxOn : copy.fxOff}
          </button>
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
                  {i === 0 || warm ? (
                    <Image
                      src={s.image.src}
                      alt={s.image.alt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 70vw"
                      className="object-contain"
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : undefined}
                    />
                  ) : null}
                  {/* mounted after load (warm) so its mask file never competes with the first photo; on the
                      first slot the light then sweeps as the ribbons fade in */}
                  {warm ? (
                    <span className="okh-sheen" style={{ "--okh-mask": `url(${mask})` } as CSSProperties} aria-hidden />
                  ) : null}
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
