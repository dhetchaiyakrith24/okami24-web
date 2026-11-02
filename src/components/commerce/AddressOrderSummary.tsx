"use client";

import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LineThumb } from "@/components/commerce/LineThumb";
import { ThaiShipMap } from "@/components/commerce/ThaiShipMap";
import type { Place } from "@/components/commerce/PostcodePlaceFields";
import type { CartView as CartViewData } from "@/lib/commerce/cart";
import { cn } from "@/lib/utils";

/**
 * The address step's order side (look A, owner 03/11): on computers a sticky card beside the form — the map with the pin on
 * the picked province, "ส่งไป · <province>", the cart's photos and amounts; on phones a folded "n ชิ้น · ฿…" line above the
 * form and a small map beside the picked place. Display only: the money is worked out again on the review step and by
 * placeOrder.
 *
 * Shipping: the review step can only take the member's monthly 0-baht shipping away (the address may have used it this
 * month — anti-reuse, shipping-rules.ts), never add it, so every other fee shown here is already the one charged. While the
 * rule is `member_monthly` the fee reads "คิดในขั้นถัดไป" and no grand total is shown, rather than a 0 that may become 35/50.
 */

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

function useAmounts(cart: CartViewData) {
  const { dict } = useLocale();
  const items = cart.lines.reduce((n, l) => n + l.quantity, 0);
  const pending = cart.totals.shippingRule === "member_monthly";
  const shipping = pending
    ? dict.checkout.shippingNextStep
    : cart.totals.shippingFee === 0
      ? dict.cart.freeShippingLabel
      : formatTHB(cart.totals.shippingFee);
  return { items, pending, shipping, headline: formatTHB(pending ? cart.totals.subtotal : cart.totals.total) };
}

function Amounts({ cart }: { cart: CartViewData }) {
  const { dict } = useLocale();
  const { items, pending, shipping } = useAmounts(cart);
  return (
    <div className="flex flex-col gap-1 text-sm">
      <div className="flex justify-between text-foreground-muted">
        <span>{dict.checkout.summaryItems.replace("{n}", String(items))}</span>
        <span>{formatTHB(cart.totals.subtotal)}</span>
      </div>
      <div className="flex justify-between text-foreground-muted">
        <span>{dict.cart.shippingLabel}</span>
        <span>{shipping}</span>
      </div>
      {!pending && (
        <div className="mt-1 flex justify-between border-t border-surface-border-soft pt-2 text-base font-semibold text-foreground">
          <span>{dict.cart.totalLabel}</span>
          <span>{formatTHB(cart.totals.total)}</span>
        </div>
      )}
    </div>
  );
}

function Destination({ place }: { place: Place | null }) {
  const { dict } = useLocale();
  if (!place) return <p className="text-sm text-foreground-dim">{dict.checkout.mapPrompt}</p>;
  return (
    <div aria-live="polite">
      <p className="text-lg font-semibold text-foreground">
        {dict.checkout.shipToProvince} · {place.province}
      </p>
      <p className="text-sm text-foreground-muted">
        {place.subdistrict} · {place.district}
      </p>
    </div>
  );
}

/** Computers (lg+): sits in the 5/12 column, sticky under the header. */
export function AddressSummaryCard({ cart, place }: { cart: CartViewData; place: Place | null }) {
  const thumbs = cart.lines.slice(0, 4);
  const more = cart.lines.length - thumbs.length;
  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-surface-border-soft bg-surface-1 p-6 lg:sticky lg:top-24">
      <ThaiShipMap province={place?.province ?? null} className="mx-auto h-60 w-auto xl:h-64" />
      <Destination place={place} />
      {cart.lines.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            {thumbs.map((line) => (
              <LineThumb key={`${line.productSlug}:${line.variantId ?? ""}`} image={line.image} />
            ))}
            {more > 0 && <span className="text-sm text-foreground-muted">+{more}</span>}
          </div>
          <Amounts cart={cart} />
        </>
      )}
    </aside>
  );
}

/** Phones and tablets (below lg): the cart folded into one line above the form; open = the lines and the amounts. */
export function CartFold({ cart, className }: { cart: CartViewData; className?: string }) {
  const { dict } = useLocale();
  const { items, headline } = useAmounts(cart);
  if (cart.lines.length === 0) return null;
  return (
    <details className={cn("group rounded-xl border border-surface-border-soft bg-surface-1", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-foreground [&::-webkit-details-marker]:hidden">
        <span className="font-medium">
          {dict.checkout.summaryItems.replace("{n}", String(items))} · {headline}
        </span>
        <span className="inline-flex items-center gap-1 text-foreground-muted">
          {dict.checkout.viewItemsCta}
          <ChevronDown size={16} aria-hidden className="motion-safe:transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="flex flex-col gap-3 border-t border-surface-border-soft px-4 py-3">
        {cart.lines.map((line) => (
          <div key={`${line.productSlug}:${line.variantId ?? ""}`} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex min-w-0 items-center gap-3">
              <LineThumb image={line.image} />
              <div className="min-w-0">
                <p className="font-medium text-foreground">{line.displayName}</p>
                {line.variantLabel && <p className="text-foreground-muted">{line.variantLabel}</p>}
                <p className="text-foreground-muted">× {line.quantity}</p>
              </div>
            </div>
            <span className="shrink-0 text-foreground">{formatTHB(line.lineTotal)}</span>
          </div>
        ))}
        <Amounts cart={cart} />
      </div>
    </details>
  );
}

/** Phones and tablets: the picked place written out in full beside a small map (the closed select cuts it off). */
export function PlaceWithMap({ place }: { place: Place }) {
  const { dict } = useLocale();
  return (
    <div className="flex items-center gap-3 rounded-lg border border-surface-border-soft bg-surface-2 p-2.5">
      <ThaiShipMap province={place.province} compact className="h-20 w-auto shrink-0" />
      <p className="text-sm text-foreground-muted">
        <span className="block text-xs text-foreground-dim">{dict.checkout.shipToProvince}</span>
        {place.subdistrict} · {place.district} · <b className="font-semibold text-foreground">{place.province}</b>
      </p>
    </div>
  );
}
