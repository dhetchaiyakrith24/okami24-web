import { NextResponse, type NextRequest } from "next/server";
import { submitPaymentSlip } from "@/lib/commerce/payment-slip";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import { sameSiteRequest } from "@/lib/staff/request-guard";

/**
 * POST /orders/<n>/slip — the customer attaches the transfer slip to their order (cart round 22/10, "pay at once").
 * Multipart: `image` (the slip) + `token` (the order's view token from the link). Same access check as the order page
 * and the QR route: the logged-in owner of the order or the view token, anything else is a 404. The check and the
 * order update = src/lib/commerce/payment-slip.ts. The image is held in memory only, never written to disk.
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

  const result = await submitPaymentSlip({
    orderNumber,
    viewToken: typeof token === "string" && token ? token : null,
    bytes: Buffer.from(await image.arrayBuffer()),
    type: image.type,
    fileName: image instanceof File && image.name ? image.name.slice(0, 100) : "slip",
  });
  if (!result.ok) return reply({ ok: false, error: result.error }, result.error === "not-found" ? 404 : 200);
  return reply({ ok: true, verdict: result.verdict });
}
