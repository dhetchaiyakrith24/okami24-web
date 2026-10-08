import { NextResponse, type NextRequest } from "next/server";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { sameSiteRequest } from "@/lib/staff/request-guard";
import type { SlipUsedResponse } from "@/lib/staff/slip-check-types";
import { setUsed } from "@/lib/staff/slip-checks";

/**
 * POST /staff/api/used — JSON `{ transRef, used }`. A staff member marks a checked slip as used once its order is
 * confirmed (or undoes a mis-tap). The next check of the same transfer then says "already used for an order"
 * instead of the softer "checked before" — the two cases staff could not tell apart on 08/10. Only the time of
 * the mark is kept (migration 0006); nothing here changes an order (BSOT §9 — a person still approves).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

function reply(body: SlipUsedResponse, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: HEADERS });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });
  if (!sameSiteRequest(request)) return new NextResponse(null, { status: 403, headers: HEADERS });

  let body: { transRef?: unknown; used?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return reply({ ok: false, error: "VALIDATION_ERROR" }, 400);
  }
  const transRef = typeof body.transRef === "string" ? body.transRef.trim() : "";
  if (!transRef || transRef.length > 64 || typeof body.used !== "boolean") return reply({ ok: false, error: "VALIDATION_ERROR" }, 400);

  const record = setUsed(transRef, body.used);
  // 200, not 404: the page reads a 404 as "session expired".
  if (!record) return reply({ ok: false, error: "NOT_FOUND" });
  return reply({ ok: true, usedAt: record.usedAt });
}
