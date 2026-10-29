import { NextResponse } from "next/server";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { minimiseOrderBody } from "@/lib/woo/log-redact";
import { recentOrderWrites } from "@/lib/woo/store";

/**
 * GET /staff/api/shipnity-order-writes — downloads every change Shipnity wrote to a web order (status · note · tracking)
 * as JSON, with the customer's name, phone and address hidden (tracking sync step 1, owner 29/10). Staff open it from
 * /staff/shipnity and send the file on, so the tracking sync is built from what Shipnity really sends. Staff session
 * required: 404 without one, like the order export.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });

  const writes = recentOrderWrites().map((c) => ({
    at: c.at,
    method: c.method,
    path: c.path,
    query: c.query,
    status: c.status,
    userAgent: c.user_agent,
    body: minimiseOrderBody(c.body),
  }));
  const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok" }).format(new Date());
  return new NextResponse(JSON.stringify({ count: writes.length, writes }, null, 2), {
    headers: {
      ...HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="shipnity-order-writes-${day}.json"`,
    },
  });
}
