import { after, NextResponse, type NextRequest } from "next/server";
import { submitPaymentSlip } from "@/lib/commerce/payment-slip";
import { saveSlipImage } from "@/lib/commerce/slip-images";
import { notifyPaidOrder } from "@/lib/line/notify";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import { sameSiteRequest } from "@/lib/staff/request-guard";

/**
 * POST /orders/<n>/slip — the customer attaches the transfer slip to their order (cart round 22/10, "pay at once").
 * Multipart: `image` (the slip) + `token` (the order's view token from the link). Same access check as the order page
 * and the QR route: the logged-in owner of the order or the view token, anything else is a 404. The check and the
 * order update = src/lib/commerce/payment-slip.ts. A slip that went through is kept as a picture for 90 days (owner
 * 26/10, src/lib/commerce/slip-images.ts) — written after the customer has their answer, together with the LINE alert.
 * Answers { ok: true, verdict } or { ok: false, error: <code> } — the order page turns the code into a sentence.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

function reply(body: { ok: true; verdict: string } | { ok: false; error: string }, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: HEADERS });
}

export async function POST(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }): Promise<NextResponse> {
  if (!sameSiteRequest(request)) return new NextResponse(null, { status: 403, headers: HEADERS });
  const { orderNumber } = await context.params;

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES + 64 * 1024) return reply({ ok: false, error: "IMAGE_SIZE_TOO_LARGE" }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, error: "NO_IMAGE" }, 400);
  }
  const image = form.get("image");
  const token = form.get("token");
  if (!(image instanceof Blob) || image.size === 0) return reply({ ok: false, error: "NO_IMAGE" }, 400);
  if (image.size > MAX_IMAGE_BYTES) return reply({ ok: false, error: "IMAGE_SIZE_TOO_LARGE" }, 413);
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(image.type)) return reply({ ok: false, error: "INVALID_IMAGE_FORMAT" }, 415);

  const bytes = Buffer.from(await image.arrayBuffer());
  const result = await submitPaymentSlip({
    orderNumber,
    viewToken: typeof token === "string" && token ? token : null,
    bytes,
    type: image.type,
    fileName: image instanceof File && image.name ? image.name.slice(0, 100) : "slip",
  });
  if (!result.ok) return reply({ ok: false, error: result.error }, result.error === "not-found" ? 404 : 200);
  // After the customer already has their answer: keep the picture (90 days), then the team's "OKM Webside order" LINE
  // group hears about the order — with the slip picture when it was kept (owner 26/10).
  after(async () => {
    const imageToken = await saveSlipImage(result.submissionId, bytes);
    await notifyPaidOrder(result.order.orderNumber, result.verdict, result.reasons, imageToken);
  });
  return reply({ ok: true, verdict: result.verdict });
}
