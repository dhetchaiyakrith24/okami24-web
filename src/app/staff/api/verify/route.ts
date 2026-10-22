import { NextResponse, type NextRequest } from "next/server";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import type { SlipCheckResponse } from "@/lib/staff/slip-check-types";
import { sameSiteRequest } from "@/lib/staff/request-guard";
import { checkSlip } from "@/lib/staff/slip-verify";

/**
 * POST /staff/api/verify — the staff page uploads ONE slip image here (multipart field `image`, optional
 * `expected` = the order total in baht). Slip-check round 2026-10-07, BSOT §9 "one exception":
 *   1. staff session required (src/lib/staff/auth.ts) — 404 without one, like a page that does not exist;
 *   2. the slip check itself = src/lib/staff/slip-verify.ts (shared with the order page and the LINE slip group
 *      since the cart round 22/10): our log first for a file seen before, otherwise EasySlip;
 *   3. the answer says whether the money went to the shop's account and whether this transfer was seen
 *      before. Nothing here changes an order — a person still approves every payment.
 * The image is read into memory, hashed and forwarded; it is never written to disk.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

function reply(body: SlipCheckResponse, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: HEADERS });
}

function parseExpected(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = Number(value.replace(/[,\s฿]/g, ""));
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? Math.round(n * 100) / 100 : null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });

  if (!sameSiteRequest(request)) return new NextResponse(null, { status: 403, headers: HEADERS });

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES + 64 * 1024) return reply({ ok: false, error: "IMAGE_SIZE_TOO_LARGE" }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, error: "VALIDATION_ERROR" }, 400);
  }
  const image = form.get("image");
  if (!(image instanceof Blob) || image.size === 0) return reply({ ok: false, error: "NO_IMAGE" }, 400);
  if (image.size > MAX_IMAGE_BYTES) return reply({ ok: false, error: "IMAGE_SIZE_TOO_LARGE" }, 413);
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(image.type)) return reply({ ok: false, error: "INVALID_IMAGE_FORMAT" }, 415);
  const expected = parseExpected(form.get("expected"));

  const bytes = Buffer.from(await image.arrayBuffer());
  const fileName = image instanceof File && image.name ? image.name.slice(0, 100) : "slip";
  return reply(await checkSlip({ bytes, type: image.type, fileName, expected, withQuota: true }));
}
