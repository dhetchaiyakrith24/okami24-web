import { NextResponse, type NextRequest } from "next/server";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { sameSiteRequest } from "@/lib/staff/request-guard";
import { SKIP_TH } from "@/lib/woo/tracking-sync-rules";
import { catchUpFromLog, type SyncResult } from "@/lib/woo/tracking-sync";

/**
 * /staff/api/shipnity-tracking-sync — catch-up for the tracking numbers Shipnity wrote before the sync existed (tracking
 * sync step 2, owner 29/10). GET = dry run: every order with a number in the call log and what the sync would do —
 * nothing changes. POST {"apply":true} = ship the orders it may, through the same step as the staff button (history
 * "Shipnity: ship"); run once after the owner's OK. Staff session required (404 without one); POST also same-site.
 * No customer name, phone or address in the answer — order numbers, statuses and tracking numbers only.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

function view(results: SyncResult[], applied: boolean) {
  const rows = results.map((r) => ({
    order: r.orderNumber,
    run: r.runNumber,
    status: r.status,
    tracking: r.tracking,
    action: r.decision.ship ? `ship (${r.decision.carrier})` : `skip: ${r.decision.reason}`,
    why: r.decision.ship ? null : SKIP_TH[r.decision.reason],
    applied: r.applied,
  }));
  return {
    mode: applied ? "applied" : "dry-run",
    willShip: rows.filter((r) => r.action.startsWith("ship")).length,
    shipped: rows.filter((r) => r.applied).length,
    rows,
  };
}

export async function GET(): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });
  return NextResponse.json(view(catchUpFromLog(false), false), { headers: HEADERS });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });
  if (!sameSiteRequest(request)) return new NextResponse(null, { status: 403, headers: HEADERS });
  const body = (await request.json().catch(() => null)) as { apply?: unknown } | null;
  if (body?.apply !== true) return NextResponse.json({ error: 'send {"apply":true}' }, { status: 400, headers: HEADERS });
  return NextResponse.json(view(catchUpFromLog(true), true), { headers: HEADERS });
}
