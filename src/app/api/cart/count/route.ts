import { NextResponse } from "next/server";
import { getCartCount } from "@/lib/commerce/cart";
import { orderingOpen, ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";
import { readSwitches } from "@/lib/commerce/shop-switches";

/**
 * How many items are in this visitor's cart — read by the floating cart button on every page (cart UX batch B, owner 24/10).
 * The pages themselves are prerendered and cannot read the cart cookie, so the button asks here after load. Per visitor,
 * so never cached. Ordering off = always 0 (the button stays hidden). It also carries the owner's switches to prerendered pages
 * (src/lib/commerce/shop-switches-rules.ts): every page already asks here after load, so they cost no extra request.
 */
export async function GET() {
  const open = orderingOpen();
  const count = open ? await getCartCount() : 0;
  return NextResponse.json(
    { count, paused: ORDERING_ENABLED && !open, hidden: readSwitches().hidden },
    { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
