import { NextResponse, type NextRequest } from "next/server";
import { getOrderDetailInternal } from "@/lib/commerce/orders";
import { refundSlipForOrder, saveRefundSlip } from "@/lib/commerce/slip-images";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import { sameSiteRequest } from "@/lib/staff/request-guard";

/**
 * /staff/orders/<n>/refund-slip (owner 26/10 evening, queue B4) — the bank slip of the refund staff transferred.
 * GET = the picture for the staff order page · POST (multipart `image`) = attach it, or replace the one attached.
 * Staff session only (POST also same-site); only an out-of-stock problem already recorded as refunded takes a slip.
 * Kept 90 days like the customer's payment slip — src/lib/commerce/slip-images.ts. A POST answers { ok } or
 * { ok: false, error } and the staff page reloads itself.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

async function staffOk(): Promise<boolean> {
  return staffAreaEnabled() && (await isStaff());
}

export async function GET(_request: NextRequest, context: { params: Promise<{ orderNumber: string }> }): Promise<NextResponse> {
  if (!(await staffOk())) return new NextResponse(null, { status: 404, headers: HEADERS });
  const { orderNumber } = await context.params;
  const order = getOrderDetailInternal(orderNumber);
  const file = order ? refundSlipForOrder(order.id) : null;
  if (!file) return new NextResponse(null, { status: 404, headers: HEADERS });
  return new NextResponse(new Uint8Array(file), { status: 200, headers: { ...HEADERS, "Content-Type": "image/jpeg" } });
}

function reply(body: { ok: true } | { ok: false; error: string }, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: HEADERS });
}

export async function POST(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }): Promise<NextResponse> {
  if (!sameSiteRequest(request)) return new NextResponse(null, { status: 403, headers: HEADERS });
  if (!(await staffOk())) return new NextResponse(null, { status: 404, headers: HEADERS });
  const { orderNumber } = await context.params;
  const order = getOrderDetailInternal(orderNumber);
  if (!order) return reply({ ok: false, error: "not-found" }, 404);

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES + 64 * 1024) return reply({ ok: false, error: "too-large" }, 413);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, error: "no-image" }, 400);
  }
  const image = form.get("image");
  if (!(image instanceof Blob) || image.size === 0) return reply({ ok: false, error: "no-image" }, 400);
  if (image.size > MAX_IMAGE_BYTES) return reply({ ok: false, error: "too-large" }, 413);
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(image.type)) return reply({ ok: false, error: "unreadable" }, 415);

  const result = await saveRefundSlip(order.id, Buffer.from(await image.arrayBuffer()));
  return result.ok ? reply({ ok: true }) : reply({ ok: false, error: result.error });
}
