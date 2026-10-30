"use client";

import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { bangkokToday, salesBadge, type SalesBadgeKind } from "@/data/sales-badges";
import { cn } from "@/lib/utils";

/**
 * "มาใหม่" / "ขายดี" (owner 30/10 — rules and sources in src/data/sales-badges.ts; look = designer 30/10). The day is read in
 * the browser, so "มาใหม่" runs out on its day even when no deploy happens in between; the server sends no badge (it cannot
 * know the visitor's day) and the badge appears after hydration. Nothing moves when it does: on a card it sits at the
 * right end of the brand line and is no taller than that line; on the product head it joins a row that already wraps.
 */

const subscribe = () => () => {};
const useToday = () =>
  useSyncExternalStore(
    subscribe,
    () => bangkokToday(Date.now()),
    () => null
  );

function useBadge(slug: string, soldOut: boolean): SalesBadgeKind | null {
  const today = useToday();
  return today === null ? null : salesBadge(slug, today, soldOut);
}

/** New = the cool steel, best seller = the shop's ember — neither green, amber nor red, which mean stock. */
const TEXT: Record<SalesBadgeKind, string> = { new: "text-steel-strong", best: "text-ember-strong" };
const FRAME: Record<SalesBadgeKind, string> = { new: "border-steel/30", best: "border-ember/30" };

/** "ขายดี" stands out (owner 31/10 "ใส่กรอบ Effect ทั้งป้ายขายดีและตัวกล่อง-การ์ด"; designer 31/10): an ember capsule that
 *  catches a light once per cycle — the light and the card frame it switches on live in globals.css ("ขายดี" stands out). */
const BEST_PILL =
  "okami-best-pill relative isolate inline-flex shrink-0 items-center gap-1 overflow-hidden rounded-full border border-ember/60 bg-ember-soft font-sans font-semibold leading-none tracking-normal text-ember-strong";
const BEST_DOT = "size-1.5 rounded-full bg-ember shadow-[0_0_6px_var(--color-ember)]";

/** The card version: coloured words with a dot, right end of the brand line; a best seller is a capsule that also frames
 *  its card (`data-sales`, read by `a[data-card-cut]:has(...)`). The negative margins keep the capsule inside the brand
 *  line's height, so the card does not grow when it lands. */
export function CardSalesBadge({ slug, soldOut = false }: { slug: string; soldOut?: boolean }) {
  const { dict } = useLocale();
  const kind = useBadge(slug, soldOut);
  if (!kind) return null;
  if (kind === "best") {
    return (
      <span data-sales="best" className={cn(BEST_PILL, "-my-[2px] h-[19px] px-2 text-[11px] max-lg:px-1.5 lg:-my-[3px] lg:h-5 lg:px-2.5 lg:text-xs")}>
        <span className={cn(BEST_DOT, "max-lg:hidden")} aria-hidden />
        {dict.product.badgeBestSeller}
      </span>
    );
  }
  return (
    <span data-sales="new" className={cn("inline-flex shrink-0 items-center gap-1 font-sans text-[11px] font-semibold leading-none tracking-normal lg:text-xs", TEXT[kind])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {dict.product.badgeNew}
    </span>
  );
}

/** The product head version: a pill beside the brand / family badges (same shape as Badge, sans words for Thai). A best
 *  seller gets the same capsule as on the cards; its glint runs three times and stops (it sits by the page title). */
export function HeadSalesBadge({ slug, soldOut = false }: { slug: string; soldOut?: boolean }) {
  const { dict } = useLocale();
  const kind = useBadge(slug, soldOut);
  if (!kind) return null;
  if (kind === "best") {
    return (
      <span data-head="" className={cn(BEST_PILL, "gap-1.5 px-2.5 py-1 text-xs")}>
        <span className={BEST_DOT} aria-hidden />
        {dict.product.badgeBestSeller}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border bg-surface-2 px-2.5 py-1 font-sans text-xs font-semibold leading-none tracking-normal", TEXT[kind], FRAME[kind])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {kind === "new" ? dict.product.badgeNew : dict.product.badgeBestSeller}
    </span>
  );
}
