import { NextResponse } from "next/server";
import { getCartCount } from "@/lib/commerce/cart";
import { ORDERING_ENABLED } from "@/lib/commerce/ordering-mode";

/**
 * How many items are in this visitor's cart — read by the floating cart button on every page (cart UX batch B, owner 24/10).
 * The pages themselves are prerendered and cannot read the cart cookie, so the button asks here after load. Per visitor,
 * so never cached. Ordering off = always 0 (the button stays hidden).
 */
export async function GET() {
  const count = ORDERING_ENABLED ? await getCartCount() : 0;
  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
