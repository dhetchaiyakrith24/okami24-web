"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/types/catalog";
import type { Locale } from "@/i18n/config";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { ANATOMY_SHEETS, type AnatomySheet, type SheetCallout, type SheetPart, type SheetText } from "@/i18n/anatomy-sheet-copy";
import { thaiTypographyNode } from "@/lib/thai-typography";
import { verifiedRows } from "@/lib/verified-specs";
import { cn } from "@/lib/utils";

/**
 * "ไล่ดูทีละส่วน" as a cream blueprint sheet — round "M Bar 10K exploded view" (owner 2026-09-30; designer direction A:
 * a design-office drawing laid on the dark page, the only light block in the section). Data and copy:
 * `src/i18n/anatomy-sheet-copy.ts`; rendered by ProductMoreDetails for the slugs listed there, so the older generic
 * ProductAnatomy on every other page is untouched.
 *
 * Every word on the sheet is page text (three languages, never baked into an image). The exploded column measures
 * where each part sits and draws the dashed leaders with an SVG after layout: labels keep their own flow and never
 * overlap, and each leader still lands on its spot at every width. Before the measurement (server HTML, no JS) the
 * labels simply stack beside the parts without leaders.
 */

const INK = "#3A3833";
const INK_SOFT = "#5B574F";
const RULE = "#B9B2A3";
const LEADER = "#8A8375";
const EMBER = "#ff6a2c";

function useText(locale: Locale) {
  return useCallback((t: SheetText): ReactNode => (locale === "th" ? thaiTypographyNode(t.th) : t[locale]), [locale]);
}

function Num({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("label-mono inline-block w-7 shrink-0 text-[0.7rem] font-semibold tabular-nums", className)} style={{ color: EMBER }} lang="en">
      {String(n).padStart(2, "0")}
    </span>
  );
}

function CalloutText({ c, text, showDetail }: { c: SheetCallout; text: (t: SheetText) => ReactNode; showDetail: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-semibold leading-snug lg:text-[0.95rem]" style={{ color: INK }}>
        {text(c.name)}
      </p>
      <p className="label-mono text-[0.6rem] leading-tight" style={{ color: LEADER, letterSpacing: "0.14em" }} lang="en">
        {c.code}
      </p>
      {showDetail && c.detail && (
        <p className="mt-1 text-[0.8rem] leading-relaxed text-pretty lg:text-[0.85rem]" style={{ color: INK_SOFT }}>
          {text(c.detail)}
        </p>
      )}
    </div>
  );
}

type Leader = { d: string; ax: number; ay: number };

function ExplodedStack({ parts, text, verified, alt }: { parts: SheetPart[]; text: (t: SheetText) => ReactNode; verified: (k?: string) => boolean; alt: (t: SheetText) => string }) {
  const box = useRef<HTMLDivElement>(null);
  const partEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelEls = useRef<(HTMLLIElement | null)[]>([]);
  const [tops, setTops] = useState<number[] | null>(null);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [height, setHeight] = useState<number | null>(null);
  const callouts = parts.flatMap((p, pi) => p.callouts.map((c) => ({ ...c, pi })));
  const widest = Math.max(...parts.map((p) => p.image.width));

  const measure = useCallback(() => {
    const root = box.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    const anchors = callouts.map((c) => {
      const el = partEls.current[c.pi];
      if (!el) return { x: 0, y: 0 };
      const b = el.getBoundingClientRect();
      return { x: b.right - r.left - b.width * 0.1, y: b.top - r.top + (b.height * c.y) / 100 };
    });
    // labels: as close to their anchor as the label above allows, never overlapping (8px gap)
    const next: number[] = [];
    let floor = 0;
    callouts.forEach((_, i) => {
      const h = labelEls.current[i]?.offsetHeight ?? 0;
      const want = anchors[i].y - 10;
      const top = Math.max(want, floor);
      next.push(top);
      floor = top + h + 8;
    });
    const first = labelEls.current[0];
    const labelLeft = (first ? first.getBoundingClientRect().left - r.left : 0) - 6;
    setTops(next);
    setHeight(Math.max(floor, ...partEls.current.map((el) => (el ? el.offsetTop + el.offsetHeight : 0))));
    setLeaders(
      anchors.map((a, i) => {
        const ly = next[i] + 10;
        const mid = a.x + (labelLeft - a.x) * 0.45;
        return { d: `M${a.x} ${a.y} H${mid} V${ly} H${labelLeft}`, ax: a.x, ay: a.y };
      }),
    );
    // callouts is derived from props that never change after mount for a given product
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parts]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);

  return (
    <div ref={box} className="relative" style={height ? { height } : undefined}>
      {/* centre axis through the parts */}
      <div className="absolute inset-y-0 left-[19%] w-px lg:left-[21%]" style={{ backgroundImage: `repeating-linear-gradient(to bottom, ${RULE} 0 6px, transparent 6px 12px)` }} aria-hidden />
      <div className="relative flex w-[38%] flex-col items-center gap-6 lg:w-[42%] lg:gap-8">
        {parts.map((p, i) => (
          <div key={p.id} ref={(el) => { partEls.current[i] = el; }} style={{ width: `${(p.image.width / widest) * 100}%` }} className="relative">
            <Image src={p.image.src} alt={alt(p.image.alt)} width={p.image.width} height={p.image.height} sizes="(min-width: 1024px) 220px, 40vw" className="block h-auto w-full drop-shadow-[0_18px_22px_rgba(58,56,51,0.28)]" />
          </div>
        ))}
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        {leaders.map((l, i) => (
          <g key={i}>
            <path d={l.d} fill="none" stroke={LEADER} strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <circle cx={l.ax} cy={l.ay} r={3.5} fill={EMBER} />
            <circle cx={l.ax} cy={l.ay} r={7} fill="none" stroke={EMBER} strokeOpacity={0.35} />
          </g>
        ))}
      </svg>
      <ol className="absolute left-[44%] right-0 top-0 flex flex-col gap-4 lg:left-[50%]">
        {callouts.map((c, i) => (
          <li
            key={c.n}
            ref={(el) => { labelEls.current[i] = el; }}
            className={cn("flex gap-1", tops && "absolute left-0 right-0")}
            style={tops ? { top: tops[i] } : undefined}
          >
            <Num n={c.n} className="pt-[0.2em]" />
            <CalloutText c={c} text={text} showDetail={!c.specKey || verified(c.specKey)} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function BottomView({ sheet, text, verified }: { sheet: AnatomySheet; text: (t: SheetText) => ReactNode; verified: (k?: string) => boolean }) {
  // Drawn from the maker's poster 04 (outline only): rim, recessed face, USB-C slot, centre button with two dimples,
  // arc slot with its small knob.
  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto w-[58%] max-w-[15rem] lg:w-[72%]" style={{ color: INK }}>
        <svg viewBox="0 0 200 200" className="block h-auto w-full" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden>
          <circle cx="100" cy="100" r="92" vectorEffect="non-scaling-stroke" />
          <circle cx="100" cy="100" r="80" vectorEffect="non-scaling-stroke" />
          <rect x="68" y="42" width="64" height="16" rx="8" vectorEffect="non-scaling-stroke" />
          <rect x="73" y="46.5" width="54" height="7" rx="3.5" fill="currentColor" fillOpacity={0.15} vectorEffect="non-scaling-stroke" />
          <circle cx="100" cy="100" r="17" fill="currentColor" fillOpacity={0.85} />
          <ellipse cx="58" cy="100" rx="5" ry="3.6" vectorEffect="non-scaling-stroke" />
          <ellipse cx="142" cy="100" rx="5" ry="3.6" vectorEffect="non-scaling-stroke" />
          <path d="M63 141 Q100 158 137 141" strokeWidth={7} strokeLinecap="round" strokeOpacity={0.9} />
          <path d="M63 141 Q100 158 137 141" stroke="#ECE6D9" strokeWidth={4.6} strokeLinecap="round" />
          <circle cx="134" cy="143" r="6.5" fill="currentColor" />
          <line x1="0" y1="100" x2="10" y2="100" stroke={RULE} vectorEffect="non-scaling-stroke" />
          <line x1="190" y1="100" x2="200" y2="100" stroke={RULE} vectorEffect="non-scaling-stroke" />
        </svg>
        {sheet.base.map((c) => (
          <span
            key={c.n}
            className="label-mono absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-[#ECE6D9] text-[0.6rem] font-semibold tabular-nums"
            style={{ left: `${c.x}%`, top: `${c.y}%`, color: EMBER, borderColor: EMBER }}
            lang="en"
            aria-hidden
          >
            {String(c.n).padStart(2, "0")}
          </span>
        ))}
      </div>
      <p className="label-mono text-center text-[0.6rem]" style={{ color: LEADER, letterSpacing: "0.14em" }} lang="en">
        BOTTOM VIEW
      </p>
      <ol className="flex flex-col gap-3">
        {sheet.base.map((c) => (
          <li key={c.n} className="flex gap-1">
            <Num n={c.n} className="pt-[0.2em]" />
            <CalloutText c={c} text={text} showDetail={!c.specKey || verified(c.specKey)} />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProductAnatomySheet({ product }: { product: Product }) {
  const { dict, locale } = useLocale();
  const text = useText(locale);
  const sheet = ANATOMY_SHEETS[product.slug];
  if (!sheet) return null;
  const rows = verifiedRows(product.specifications);
  const verified = (k?: string) => !k || rows.some((r) => r.key === k);
  const alt = (t: SheetText) => t[locale];
  const facts = sheet.facts.filter((f) => verified(f.specKey));

  return (
    <section className="mt-10 lg:mt-14" aria-labelledby="anatomy-sheet-title">
      <div className="flex flex-col gap-3">
        <span className="label-mono text-xs text-ember">{dict.product.anatomyEyebrow}</span>
        <h3 id="anatomy-sheet-title" className="font-display text-2xl font-semibold leading-tight tracking-tight text-foreground lg:text-[2rem]">
          {text(sheet.heading)}
        </h3>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-2xl p-4 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-6 lg:mt-8 lg:p-10" style={{ backgroundColor: "#ECE6D9", color: INK }}>
        {/* drawing frame + corner ticks */}
        <div className="pointer-events-none absolute inset-3 rounded-lg border lg:inset-4" style={{ borderColor: "#CFC7B6" }} aria-hidden />
        {["left-3 top-3 lg:left-4 lg:top-4", "right-3 top-3 lg:right-4 lg:top-4", "bottom-3 left-3 lg:bottom-4 lg:left-4", "bottom-3 right-3 lg:bottom-4 lg:right-4"].map((pos) => (
          <span key={pos} className={cn("pointer-events-none absolute h-3 w-3", pos)} aria-hidden>
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: RULE }} />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: RULE }} />
          </span>
        ))}

        <div className="relative flex flex-col gap-8 lg:gap-12">
          {/* title block */}
          <div className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-2" style={{ borderColor: RULE }}>
            <p className="label-mono text-[0.7rem] font-semibold" style={{ color: INK, letterSpacing: "0.18em" }} lang="en">
              {product.displayName}
            </p>
            <p className="text-xs font-medium" style={{ color: INK_SOFT }}>
              {text(sheet.sheetTitle)}
              <span className="label-mono ml-2 text-[0.6rem]" style={{ color: LEADER, letterSpacing: "0.14em" }} lang="en">
                EXPLODED VIEW
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <figure className="hidden flex-col items-center justify-center gap-3 lg:col-span-3 lg:flex">
              <Image
                src={sheet.assembled.src}
                alt={alt(sheet.assembled.alt)}
                width={sheet.assembled.width}
                height={sheet.assembled.height}
                sizes="260px"
                className="h-auto max-h-[32rem] w-auto drop-shadow-[0_24px_30px_rgba(58,56,51,0.3)]"
              />
              <figcaption className="label-mono text-[0.6rem]" style={{ color: LEADER, letterSpacing: "0.14em" }} lang="en">
                3/4 VIEW
              </figcaption>
            </figure>
            <div className="lg:col-span-5">
              <ExplodedStack parts={sheet.parts} text={text} verified={verified} alt={alt} />
            </div>
            <div className="border-t pt-8 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0" style={{ borderColor: RULE }}>
              <BottomView sheet={sheet} text={text} verified={verified} />
            </div>
          </div>

          <div className="border-t pt-8" style={{ borderColor: RULE }}>
            <ul className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
              {sheet.zooms.map((z) => (
                <li key={z.id} className="flex flex-col gap-2">
                  <div className="relative aspect-square overflow-hidden rounded-md border" style={{ borderColor: "#CFC7B6" }}>
                    <Image src={z.image.src} alt={alt(z.image.alt)} fill sizes="(min-width: 1024px) 260px, 30vw" className="object-cover" />
                    {z.leds &&
                      [28, 42, 56, 70].map((x) => (
                        <span
                          key={x}
                          className="absolute aspect-square w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.55)]"
                          style={{ left: `${x}%`, top: "45.5%" }}
                          aria-hidden
                        />
                      ))}
                  </div>
                  <p className="text-xs font-semibold leading-snug" style={{ color: INK }}>
                    {text(z.name)}
                  </p>
                  <p className="label-mono -mt-1.5 text-[0.55rem] leading-tight" style={{ color: LEADER, letterSpacing: "0.14em" }} lang="en">
                    {z.code}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {facts.length > 0 && (
            <div className="flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: RULE }}>
              <ul className="flex flex-wrap gap-2">
                {facts.map((f) => (
                  <li key={f.specKey} className="rounded-full border px-3 py-1 text-xs font-medium" style={{ borderColor: RULE, color: INK }}>
                    {text(f.text)}
                  </li>
                ))}
              </ul>
              <p className="text-[0.7rem]" style={{ color: INK_SOFT }}>
                {text(sheet.note)}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
