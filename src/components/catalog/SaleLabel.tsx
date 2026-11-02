"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";
import { saleLabel } from "@/data/sale-label";
import { cn } from "@/lib/utils";

/**
 * The price with its struck-through label and "−N%" chip (owner 03/11, rules in src/data/sale-label.ts). Look = designer 03/11
 * option A: one line, real price first (every card's price keeps its left edge), then the struck label, then a solid red
 * chip — square-ish corners, no dot, no glow, so it never reads as one of the rounded "มาใหม่" / "ขายดี" / stock capsules.
 * Nothing is added below the price: a labelled card is exactly as tall as its neighbours. Decided from the build (the slug,
 * the approved price, the built stock), so it is in the first paint and nothing moves after hydration. A product with no
 * label renders the price line exactly as before. Words = thai-copy 03/11: "ราคาป้าย", never "ราคาปกติ" — the label was
 * never the selling price.
 */

const baht = (n: number) => `฿${n.toLocaleString("th-TH")}`;

/** Card price line (`data-card-price`), both card kinds. */
export function CardPrice({ slug, price, soldOut = false }: { slug: string; price: number | null | undefined; soldOut?: boolean }) {
  const { dict } = useLocale();
  const sale = saleLabel(slug, price, soldOut);
  const base = "min-h-[1.25rem] font-display text-[15px] font-bold leading-tight text-foreground lg:text-lg";
  if (price == null) return <p className={base} data-card-price />;
  if (!sale) return <p className={base} data-card-price>{baht(price)}</p>;
  return (
    <p className={cn(base, "flex items-baseline gap-1.5 overflow-hidden whitespace-nowrap lg:gap-2")} data-card-price data-sale-pct={sale.pct}>
      <span className="sr-only">{dict.product.sellingPriceSr.replace("{price}", baht(price))}</span>
      <span aria-hidden>{baht(price)}</span>
      <s className="text-[11px] font-medium text-foreground-muted decoration-foreground-muted/70 lg:text-sm" data-list-price>
        <span className="sr-only">{dict.product.listPriceSr.replace("{price}", baht(sale.label))}</span>
        <span aria-hidden>{baht(sale.label)}</span>
      </s>
      <SaleChip pct={sale.pct} className="rounded-[4px] px-1 text-[10px] leading-[14px] lg:px-1.5 lg:text-xs lg:leading-4" />
    </p>
  );
}

/** Product page price (under the "ราคา" label), both product page kinds. The real price comes first in the reading order,
 *  right after the visible "ราคา", so it needs no extra words (thai-copy 03/11). */
export function HeadPrice({ slug, price, soldOut = false }: { slug: string; price: number; soldOut?: boolean }) {
  const { dict } = useLocale();
  const sale = saleLabel(slug, price, soldOut);
  const priceClass = "font-display text-3xl font-bold text-foreground max-lg:text-2xl";
  if (!sale) return <p className={priceClass}>{baht(price)}</p>;
  return (
    <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1" data-sale-pct={sale.pct}>
      <span className={priceClass}>{baht(price)}</span>
      <s className="font-display text-lg font-medium text-foreground-muted decoration-foreground-muted/70 max-lg:text-base" data-list-price>
        <span className="sr-only">{dict.product.listPriceSr.replace("{price}", baht(sale.label))}</span>
        <span aria-hidden>{baht(sale.label)}</span>
      </s>
      <SaleChip pct={sale.pct} className="rounded-md px-2 font-display text-sm leading-6 max-lg:px-1.5 max-lg:text-xs max-lg:leading-5" />
    </p>
  );
}

function SaleChip({ pct, className }: { pct: number; className: string }) {
  const { dict } = useLocale();
  return (
    <span className={cn("self-center bg-sale font-bold text-white", className)} data-sale-badge="">
      <span className="sr-only">{dict.product.saleBadgeSr.replace("{n}", String(pct))}</span>
      <span aria-hidden>{dict.product.saleBadge.replace("{n}", String(pct))}</span>
    </span>
  );
}
