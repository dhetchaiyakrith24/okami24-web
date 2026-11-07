"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { CartShippingHint } from "@/lib/commerce/cart";

/**
 * The lines under the shipping row of the cart and the review step (owner 29/10, BSOT §10): why the fee is what it is,
 * before the customer pays — then, when it can drop, how much more brings it down, and (signed out) the sign-in that
 * gives a member 0 shipping once a month from 300 THB. Display only: the amount itself is `cart.totals.shippingFee`.
 */
export function ShippingNote({ hint, formatTHB, signInNext }: { hint: CartShippingHint; formatTHB: (n: number) => string; signInNext: string }) {
  const { dict, locale } = useLocale();
  const c = dict.cart;
  // Visitor walk 07/11: at ฿299 a guest read "฿201 more for 35" above "members 0 at 300" as two rules, the first the
  // worse one. While the member benefit is open, the guest sees that offer alone; the 0 at 800 stays, it is for everyone.
  const next = hint.next && (hint.signedIn || hint.benefitUsed || hint.next.fee === 0) ? hint.next : null;
  // Thai: break only at the spaces between phrases — in this narrow box the browser's segmenter split "ค่า | ส่ง" (tier-B
  // scan 29/10). The phrases are short, so a nowrap run never overflows; en breaks at spaces anyway, zh has none.
  const text = (s: string) =>
    locale === "th"
      ? s.split(" ").map((part, i) => (
          // The space stays outside the nowrap run — inside it, it would not be a break point.
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="whitespace-nowrap">{part}</span>
          </Fragment>
        ))
      : s;
  return (
    <div className="flex flex-col gap-1 text-xs leading-relaxed text-foreground-dim">
      {/* The reason is what the customer must read before paying (checker 29/10: at 390 the dim 12px line read too faint). */}
      <p className="text-sm text-foreground-muted">{text(c.shippingNote[hint.noteKey])}</p>
      {/* Customer walk 05/11: fee row ฿50, then "35" and "0" straight under it read as three prices for one order. The
          offers now sit apart under their own heading; the reason line above stays the only line about this order's fee. */}
      {(next || !hint.signedIn) && (
        <div className="mt-1 flex flex-col gap-1 rounded-lg border border-surface-border px-3 py-2">
          {hint.noteKey !== "over800" && <p className="font-semibold text-foreground-muted">{text(c.shippingLowerHeading)}</p>}
          {next && (
            <p className="text-foreground-muted">
              {text((next.fee === 0 ? c.shippingNextFree : c.shippingNextReduced).replace("{n}", formatTHB(next.addMore)).replace("{fee}", String(next.fee)))}
            </p>
          )}
          {!hint.signedIn && (
            <p>
              {text(hint.benefitUsed ? c.shippingSignInUsedNote : c.shippingSignInNote)}{" "}
              <Link href={`/account/login?next=${encodeURIComponent(signInNext)}`} className="text-ember underline underline-offset-2">
                {text(c.shippingSignInCta)}
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
