"use client";

import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { thaiTypographyNode } from "@/lib/thai-typography";
import type { HeroType } from "@/data/home-hero";
import type { HeroSlotView } from "./HeroShowcase";
import { Decode } from "./Decode";

const PHOTO_SIZES = "(min-width: 1024px) 40vw, 70vw";

/**
 * The desktop hero's four slots as cards in a row (DESKTOP_HERO "cards", owner 21/10 — the Artefakt "collection" row):
 * index · brand (top) · the product's own card photo · model + price · type tag + colour/flavour count, which turn into a
 * "view product" bar on hover. Shown from 64rem up only (globals.css); phones keep the stage + tabs.
 * The photos use the stage's `sizes`, so card 1 and the (hidden) stage's first photo are the same file — one download.
 */
export const HeroCards = forwardRef<HTMLDivElement, { slots: HeroSlotView[]; typeTag: Record<HeroType, string> }>(
  function HeroCards({ slots, typeTag }, ref) {
    const { dict, locale } = useLocale();
    const tx = (s: string) => (locale === "th" ? thaiTypographyNode(s) : s);
    const [intro, setIntro] = useState(0);
    const [hover, setHover] = useState<number[]>(() => slots.map(() => 0));

    // the labels tune in once, when the row is first on screen after the page has loaded
    useEffect(() => {
      const el = typeof ref === "object" ? ref?.current : null;
      if (!el) return;
      let io: IntersectionObserver | null = null;
      const arm = () => {
        io = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return;
          setIntro(1);
          io?.disconnect();
        });
        io.observe(el);
      };
      if (document.readyState === "complete") arm();
      else window.addEventListener("load", arm, { once: true });
      return () => {
        window.removeEventListener("load", arm);
        io?.disconnect();
      };
    }, [ref]);

    return (
      <div ref={ref} className="okh-cards">
        {slots.map((s, i) => {
          // the brand label re-tunes on every hover; the model name only once, when the row first shows — a name that
          // scrambles while the visitor reads it is just unreadable (designer 21/10)
          const brandRun = intro + hover[i];
          const options = s.options
            ? (s.options.kind === "flavors" ? dict.catalog.optionCountFlavors : dict.catalog.optionCountColors).replace("{n}", String(s.options.n))
            : null;
          return (
            <Link
              key={s.productHref}
              href={s.productHref}
              className="okh-card"
              onMouseEnter={() => setHover((h) => h.map((v, j) => (j === i ? v + 1 : v)))}
            >
              <span className="okh-card-top label-mono" lang="en">
                <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                <span className="okh-card-brand">
                  <Decode text={s.brand} run={brandRun} delay={i * 110} />
                </span>
                <svg className="okh-card-arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M5 11l6-6M6 5h5v5" />
                </svg>
              </span>
              <span className="okh-card-img">
                {/* DESKTOP_TRAVEL: the photo sits in a box as tall as the row's end size, shrunk to fit at rest — sharp at both ends */}
                <span className="okh-card-ph">
                  <Image
                    src={s.image.src}
                    alt={s.image.alt}
                    fill
                    sizes={PHOTO_SIZES}
                    className="object-contain"
                    {...(i === 0 ? ({ loading: "eager", fetchPriority: "high" } as const) : ({ loading: "lazy" } as const))}
                  />
                </span>
              </span>
              <span className="okh-card-head">
                <span className="okh-card-name font-display" lang="en">
                  <Decode text={s.name} run={intro} delay={i * 110 + 60} />
                </span>
                {s.price !== null ? <span className="okh-card-price">฿{s.price.toLocaleString("th-TH")}</span> : null}
              </span>
              <span className="okh-card-foot">
                <span className="okh-card-tags">
                  <em className="label-mono" lang="en">
                    {typeTag[s.type]}
                  </em>
                  {options ? <em>{tx(options)}</em> : null}
                </span>
                <span className="okh-card-cta">
                  {/* the shop's existing "view product" words; the arrow is drawn here so it can sit at the far end */}
                  <span>{tx(dict.hero.viewProduct.replace(/\s*→\s*$/, ""))}</span>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    );
  },
);
