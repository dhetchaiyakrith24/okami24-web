"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { countKind, countText } from "@/lib/stock/count-rules";
import { cn } from "@/lib/utils";

/**
 * The warehouse count on the product page (owner 30/10 "2 A": the picked option's count, live after load; words and
 * thresholds = src/lib/stock/count-rules.ts; placement = designer 30/10). Every piece renders nothing until /api/stock
 * answered with a number, so a page without one looks exactly as before.
 */

/** The picked option's count by the buy action (desktop) or under the price (phone, a product without options).
 *  Amber with a dot at ≤ 3; a muted plain line otherwise. `reserve` keeps the line's height while there is no number,
 *  so the buy button does not jump when the answer lands. */
export function StockCountLine({ left, reserve = false, className }: { left?: number; reserve?: boolean; className?: string }) {
  const { dict } = useLocale();
  if (left === undefined) return reserve ? <p className={cn("min-h-5", className)} aria-hidden /> : null;
  const { kind, text } = countText(dict.product, left);
  return (
    <p aria-live="polite" className={cn("flex min-h-5 items-center gap-2 text-sm font-medium", kind === "low" ? "text-low" : "text-foreground-muted", className)}>
      {kind === "low" && <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden />}
      {text}
    </p>
  );
}

/** The short amber "เหลือ N" on a desktop flavour chip, only at ≤ 3 — where "สินค้าหมด" sits on a sold-out chip. */
export function LowStockTag({ left }: { left?: number }) {
  const { dict } = useLocale();
  if (left === undefined || countKind(left) !== "low") return null;
  return <span className="font-sans text-[0.6rem] font-semibold normal-case tracking-normal text-low">{dict.product.stockLeftShort.replace("{n}", String(left))}</span>;
}

/** A desktop colour dot has no room for words: an amber corner dot at ≤ 3 (the count line by the buy action says the number). */
export function LowStockDot({ left }: { left?: number }) {
  if (left === undefined || countKind(left) !== "low") return null;
  return <span className="pointer-events-none absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-low ring-2 ring-surface-1" aria-hidden />;
}

/** The option's name with the low-stock words, for a dot's title / aria-label (null = not low). */
export function useLowStockTitle(): (name: string, left?: number) => string | null {
  const { dict } = useLocale();
  return (name, left) => (left !== undefined && countKind(left) === "low" ? `${name} — ${countText(dict.product, left).text}` : null);
}
