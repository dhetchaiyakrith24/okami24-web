import { NextResponse, type NextRequest } from "next/server";
import { getOrderDetailForViewer } from "@/lib/commerce/orders";
import { refundSlipForOrder } from "@/lib/commerce/slip-images";

/**
 * GET /orders/<n>/refund-slip?token=… — the bank slip of the refund the shop transferred, for the customer's own order
 * page (owner 26/10 evening, queue B4: "คืนเงินแล้ว" + the slip so the customer can check). Same access check as the
 * order page and the QR route: the logged-in owner of the order or the view token; anything else — no order, no slip
 * attached, or deleted after its 90 days — is a 404.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }): Promise<NextResponse> {
  const { orderNumber } = await context.params;
  const order = await getOrderDetailForViewer(orderNumber, request.nextUrl.searchParams.get("token"));
  const file = order ? refundSlipForOrder(order.id) : null;
  if (!file) return new NextResponse(null, { status: 404, headers: HEADERS });
  return new NextResponse(new Uint8Array(file), { status: 200, headers: { ...HEADERS, "Content-Type": "image/jpeg" } });
}
