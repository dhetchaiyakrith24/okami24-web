import { NextResponse } from "next/server";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { ordersCsv } from "@/lib/staff/orders-export";

/**
 * GET /staff/api/export — downloads every web order as a CSV that opens in Excel (owner 23/10). Staff session
 * required: 404 without one, like a page that does not exist. The file holds customer names, phones and addresses,
 * so it is never cached and never indexed; it lives only on the computer that downloads it.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });

  const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok" }).format(new Date());
  return new NextResponse(ordersCsv(), {
    headers: {
      ...HEADERS,
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="okami24-orders-${day}.csv"`,
    },
  });
}
