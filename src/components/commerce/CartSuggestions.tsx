"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { labelLang } from "@/lib/label-lang";
import { pilotName } from "@/i18n/product-names-en";
import type { CartSuggestion } from "@/lib/commerce/cart-suggestions";

function formatTHB(value: number): string {
  return `฿${value.toLocaleString("th-TH")}`;
}

/**
 * The cart's suggestion row (owner queue Q8, designer spec 26/10) — the cards come picked from the server
 * (`cartSuggestions`), so this file holds no catalog. Calm on purpose ("ยืนบนความเรียบหรู"): each card is one link to the
 * product page (options are chosen there — no add button), hover only lifts the border colour; no lift, zoom or glow
 * (the green glow belongs to "shipped"). Phones 2 × 2 under the checkout button; ≥640 one row of four.
 */
export function CartSuggestions({ items, className = "" }: { items: CartSuggestion[]; className?: string }) {
  const { dict, locale } = useLocale();
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="cart-suggestions" className={className}>
      <h2 id="cart-suggestions" className="mb-4 font-display text-xl font-semibold text-foreground">
        {dict.cart.suggestionsTitle}
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-border bg-surface-1 transition-colors hover:border-foreground-dim focus-visible:outline-2 focus-visible:outline-ember"
            >
              <div className="relative aspect-square bg-surface-2/40">
                {item.image && <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 1024px) 190px, 45vw" className="object-contain p-3" />}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                {/* an empty brand line keeps every name and price on the same baseline */}
                <span className="label-mono min-h-[1.2em] text-[0.6rem] text-foreground-dim" lang={labelLang(item.brandName)}>
                  {item.brandName ?? ""}
                </span>
                <span className="line-clamp-2 min-h-[2.5em] text-sm font-semibold leading-[1.25] text-foreground">
                  {pilotName(item.slug, item.name, locale)}
                </span>
                <span className="mt-auto pt-1 font-display text-[15px] font-bold text-foreground">{formatTHB(item.price)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
