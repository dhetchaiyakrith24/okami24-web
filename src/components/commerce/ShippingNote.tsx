"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { CartShippingHint } from "@/lib/commerce/cart";

/**
 * The lines under the shipping row of the cart and the review step (owner 29/10, BSOT §10): why the fee is what it is,
 * before the customer pays — then, when it can drop, how much more brings it down, and (cart only, signed out) the sign-in
 * that gives a member's first order 0 shipping. Display only: the amount itself is `cart.totals.shippingFee`.
 */
export function ShippingNote({ hint, formatTHB, signInNext }: { hint: CartShippingHint; formatTHB: (n: number) => string; signInNext?: string }) {
  const { dict } = useLocale();
  const c = dict.cart;
  const next = hint.next;
  return (
    <div className="flex flex-col gap-1 text-xs leading-relaxed text-foreground-dim">
      <p>{c.shippingNote[hint.noteKey]}</p>
      {next && (
        <p className="text-foreground-muted">
          {(next.fee === 0 ? c.shippingNextFree : c.shippingNextReduced).replace("{n}", formatTHB(next.addMore)).replace("{fee}", String(next.fee))}
        </p>
      )}
      {signInNext && !hint.signedIn && (
        <p>
          {c.shippingSignInNote}{" "}
          <Link href={`/account/login?next=${encodeURIComponent(signInNext)}`} className="text-ember underline underline-offset-2">
            {c.shippingSignInCta}
          </Link>
        </p>
      )}
    </div>
  );
}
