import { NextResponse } from "next/server";
import { getOrderDetailInternal } from "@/lib/commerce/orders";
import { slipImageForOrder } from "@/lib/commerce/slip-images";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";

/**
 * GET /staff/orders/<number>/slip-image — the slip picture the customer attached, for the staff order page (owner 26/10,
 * queue B2 (c): kept 90 days). Staff session only; anything else — no session, no order, no picture (never kept, or
 * deleted after 90 days) — is a 404.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(_request: Request, context: { params: Promise<{ orderNumber: string }> }): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });
  const { orderNumber } = await context.params;
  const order = getOrderDetailInternal(orderNumber);
  const file = order ? slipImageForOrder(order.id) : null;
  if (!file) return new NextResponse(null, { status: 404, headers: HEADERS });
  return new NextResponse(new Uint8Array(file), { status: 200, headers: { ...HEADERS, "Content-Type": "image/jpeg" } });
}
