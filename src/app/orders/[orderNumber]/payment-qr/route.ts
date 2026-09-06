import { readFile } from "node:fs/promises";
import { NextResponse, type NextRequest } from "next/server";
import { getOrderDetailForViewer } from "@/lib/commerce/orders";
import { promptpayQrPath } from "@/data/payment";

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
  if (!order || order.status !== "pending_payment") return new NextResponse(null, { status: 404 });

  try {
    const file = await readFile(promptpayQrPath());
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
