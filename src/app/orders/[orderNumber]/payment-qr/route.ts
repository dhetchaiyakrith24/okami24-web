import { readFile } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderDetailForViewer } from "@/lib/commerce/orders";
import { sweepIfPastDeadline } from "@/lib/commerce/unpaid-expiry";
import { promptpayQrPath } from "@/data/payment";
import { amountQrPng } from "@/lib/commerce/promptpay-qr";

/**
 * Serves the shop's PromptPay QR to the viewer of ONE order — owner rule 2026-09-06: the QR is
 * never public. Same access check as the order page (logged-in owner of the order, or the
 * order's view token in the link); anything else is a 404, the same answer a missing order gets.
 * The file lives in the gitignored `.data/private/` folder, not under `public/`, so no URL
 * guess can reach it without passing this check. No file yet = 404 and the order page simply
 * shows the account number without a QR.
 */
export async function GET(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await context.params;
  const token = request.nextUrl.searchParams.get("token");
  const order = await getOrderDetailForViewer(orderNumber, token);
  // Past the 24-hour deadline = no QR, even before the 15-minute sweep reaches the order (checker #811 note).
  if (!order || order.status !== "pending_payment" || sweepIfPastDeadline(order)) return new NextResponse(null, { status: 404 });

  try {
    // Owner 23/10 (BSOT §9): the QR carries this order's total, so the banking app fills the amount in. If the shop
    // QR cannot be turned into one, the owner's file is served as before (the page note then says to type the total).
    const file = (await amountQrPng(order.total)) ?? (await readFile(promptpayQrPath()));
    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
