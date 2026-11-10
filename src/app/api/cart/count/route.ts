import { revalidatePath } from "next/cache";
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
/** Once per server process (globalThis: every bundle shares it). */
const boot = globalThis as typeof globalThis & { __okami24CopyRefreshed?: boolean };

export async function GET() {
  const open = orderingOpen();
  // T2-04: `next build` reads the switches as open, and pages re-rendered before a restart may be kept on disk with the switch
  // as it was then — so the first visit after a boot (every page asks here after load) marks every page stale, whichever way
  // the switch stands now. Once per process; pages re-render on their next visit.
  if (ORDERING_ENABLED && !boot.__okami24CopyRefreshed) {
    boot.__okami24CopyRefreshed = true;
    try {
      revalidatePath("/", "layout");
    } catch (err) {
      console.error(`[switches] page refresh after boot failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  const count = open ? await getCartCount() : 0;
  return NextResponse.json(
    { count, paused: ORDERING_ENABLED && !open, hidden: readSwitches().hidden },
    { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } },
  );
}
