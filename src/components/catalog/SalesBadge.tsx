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

/** The card version: coloured words with a dot, right end of the brand line. */
export function CardSalesBadge({ slug, soldOut = false }: { slug: string; soldOut?: boolean }) {
  const { dict } = useLocale();
  const kind = useBadge(slug, soldOut);
  if (!kind) return null;
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 font-sans text-[11px] font-semibold leading-none tracking-normal lg:text-xs", TEXT[kind])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {kind === "new" ? dict.product.badgeNew : dict.product.badgeBestSeller}
    </span>
  );
}

/** The product head version: a pill beside the brand / family badges (same shape as Badge, sans words for Thai). */
export function HeadSalesBadge({ slug, soldOut = false }: { slug: string; soldOut?: boolean }) {
  const { dict } = useLocale();
  const kind = useBadge(slug, soldOut);
  if (!kind) return null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border bg-surface-2 px-2.5 py-1 font-sans text-xs font-semibold leading-none tracking-normal", TEXT[kind], FRAME[kind])}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {kind === "new" ? dict.product.badgeNew : dict.product.badgeBestSeller}
    </span>
  );
}
