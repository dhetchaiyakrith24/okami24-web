"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { bangkokToday, salesBadges, type SalesBadgeKind } from "@/data/sales-badges";
import { cn } from "@/lib/utils";

/**
 * "มาใหม่" / "ขายดี" (owner 30/10 — rules and sources in src/data/sales-badges.ts; look = designer 30/10 + 02/11). The day is
 * read in the browser, so "มาใหม่" runs out on its day even when no deploy happens in between; the server sends no badge (it
 * cannot know the visitor's day) and the badges appear after hydration. Nothing moves when they do: on a card they sit at
 * the right end of the brand line and are no taller than that line; on the product head they join a row that already wraps.
 * Both can show at once (owner 02/11): [มาใหม่][ขายดี], best seller at the right end.
 */

const subscribe = () => () => {};
const useToday = () =>
  useSyncExternalStore(
    subscribe,
    () => bangkokToday(Date.now()),
    () => null
  );

function useBadges(slug: string, soldOut: boolean): SalesBadgeKind[] {
  const today = useToday();
  return today === null ? [] : salesBadges(slug, today, soldOut);
}

/** "ขายดี" stands out (owner 31/10 "ใส่กรอบ Effect ทั้งป้ายขายดีและตัวกล่อง-การ์ด"; designer 31/10): an ember capsule that
 *  catches a light once per cycle — the light and the card frame it switches on live in globals.css ("ขายดี" stands out). */
const BEST_PILL =
  "okami-best-pill relative isolate inline-flex shrink-0 items-center gap-1 overflow-hidden rounded-full border border-ember/60 bg-ember-soft font-sans font-semibold leading-none tracking-normal text-ember-strong";
const BEST_DOT = "size-1.5 rounded-full bg-ember shadow-[0_0_6px_var(--color-ember)]";

/** "มาใหม่" = the "Night" purple capsule (owner 02/11 "หาคู่สีเลยว่าอะไรเหมาะกับส้มดำ"; designer 02/11 option A): built like the
 *  best-seller capsule (soft fill, line, bright words, a still glowing dot) but no glint and no card frame. Purple means new
 *  and nothing else on the site (steel = option counts and brands, ember = best seller, green/amber/red = stock). No
 *  overflow-hidden: the tone marks of "ใหม่" rise above the line box. */
const NEW_PILL =
  "inline-flex shrink-0 items-center gap-1 rounded-full border border-night-line/60 bg-night-soft font-sans font-semibold leading-none tracking-normal text-night-strong";
const NEW_DOT = "size-1.5 rounded-full bg-night shadow-[0_0_6px_var(--color-night)]";

/** Card capsule size: the negative margins keep it inside the brand line's height, so the card does not grow when it lands. */
const CARD_PILL = "-my-[3px] h-[19px] px-2 text-[11px] max-lg:px-1.5 lg:h-5 lg:px-2.5 lg:text-xs";

/** The card version, right end of the brand line (the brand name truncates first); a best seller also frames its card
 *  (`data-sales="best"`, read by `a[data-card-cut]:has(...)`). Dots show from lg only — at 390 two capsules leave the brand
 *  little room. */
export function CardSalesBadge({ slug, soldOut = false }: { slug: string; soldOut?: boolean }) {
  const { dict } = useLocale();
  const kinds = useBadges(slug, soldOut);
  if (kinds.length === 0) return null;
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      {kinds.map((kind) =>
        kind === "best" ? (
          <span key={kind} data-sales="best" className={cn(BEST_PILL, CARD_PILL)}>
            <span className={cn(BEST_DOT, "max-lg:hidden")} aria-hidden />
            <span className="lg:hidden">{dict.product.badgeBestSellerShort}</span>
            <span className="max-lg:hidden">{dict.product.badgeBestSeller}</span>
          </span>
        ) : (
          <span key={kind} data-sales="new" className={cn(NEW_PILL, CARD_PILL)}>
            <span className={cn(NEW_DOT, "max-lg:hidden")} aria-hidden />
            {dict.product.badgeNew}
          </span>
        ),
      )}
    </span>
  );
}

/** "ขายดี" on one flavour / colour (owner 02/11, src/data/bestseller-options.ts): the same ember capsule without the
 *  moving light — a picker can hold several and twenty glints would fight the photo. Comes from the build, so it is in
 *  the first paint (no hydration wait, nothing moves). */
export function OptionBestTag({ className }: { className?: string }) {
  const { dict } = useLocale();
  return (
    <span
      data-option-best=""
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border border-ember/60 bg-ember-soft px-1.5 py-0.5 font-sans text-[10px] font-semibold leading-none tracking-normal text-ember-strong",
        className,
      )}
    >
      {dict.product.badgeBestSeller}
    </span>
  );
}

/** The product head version: pills beside the brand / family badges (same shape as Badge, sans words for Thai), kept on
 *  one line together. leading-none after text-xs: tailwind-merge drops the pill's leading-none when text-xs
 *  follows, and a 26px pill grew the row after hydration (checker 02/11). The best-seller glint runs three times and stops (it sits by the page title). */
export function HeadSalesBadge({ slug, soldOut = false }: { slug: string; soldOut?: boolean }) {
  const { dict } = useLocale();
  const kinds = useBadges(slug, soldOut);
  if (kinds.length === 0) return null;
  return (
    <span className="inline-flex flex-nowrap items-center gap-1.5">
      {kinds.map((kind) =>
        kind === "best" ? (
          <span key={kind} data-head="" className={cn(BEST_PILL, "gap-1.5 px-2.5 py-1 text-xs leading-none")}>
            <span className={BEST_DOT} aria-hidden />
            {dict.product.badgeBestSeller}
          </span>
        ) : (
          <span key={kind} className={cn(NEW_PILL, "gap-1.5 px-2.5 py-1 text-xs leading-none")}>
            <span className={NEW_DOT} aria-hidden />
            {dict.product.badgeNew}
          </span>
        ),
      )}
    </span>
  );
}
