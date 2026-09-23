import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { MAX_BODY_BYTES, parseLineClick } from "@/lib/metrics/line-click-input";
import { lineClickSummary, recordLineClick } from "@/lib/metrics/line-clicks";

/**
 * LINE-click counter endpoint (round 8, owner ruling 2026-09-23 "option ก": count in-site, no
 * cookies, nothing sent outside).
 *
 * POST — the browser's `navigator.sendBeacon` from `LineClickTracker.tsx` lands here with a tiny
 * JSON body `{ page, spot }`. Answer is always 204 (or 4xx for a body that is not a click); the
 * visitor's click on the LINE link has already opened LINE by then, nothing here can slow it.
 * Cookies are not read. No IP, user agent or id is stored — see 0003_line_clicks.sql.
 *
 * GET — the read-out for Cowork/the owner, who cannot run scripts on the Render disk. Gated by
 * `OKAMI24_METRICS_TOKEN` (set in the Render dashboard — docs/DEPLOY-RENDER.md); while the
 * variable is unset the route answers 404 like a page that does not exist, so nothing is exposed
 * by deploying this before the token is chosen. The token goes in the `X-OKami24-Metrics-Key`
 * header, or `?key=` for a browser address bar (the numbers are aggregate counts — the worst a
 * leaked key reveals is how many people clicked LINE). Optional `?days=30` (1–365).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

function empty(status: number): NextResponse {
  return new NextResponse(null, { status, headers: HEADERS });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return empty(413);

  let body: string;
  try {
    body = await request.text();
  } catch {
    return empty(400);
  }
  if (body.length > MAX_BODY_BYTES) return empty(413);

  const click = parseLineClick(body);
  if (!click) return empty(400);

  try {
    recordLineClick(click);
  } catch {
    // A counter must never surface an error to a visitor; the click itself already happened.
  }
  return empty(204);
}

function keyMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.OKAMI24_METRICS_TOKEN?.trim() ?? "";
  if (expected.length < 16) return empty(404);
  const given = request.headers.get("x-okami24-metrics-key") ?? request.nextUrl.searchParams.get("key") ?? "";
  if (!keyMatches(given, expected)) return empty(404);

  const daysParam = Number(request.nextUrl.searchParams.get("days") ?? "30");
  const days = Number.isFinite(daysParam) ? Math.max(1, Math.min(365, Math.floor(daysParam))) : 30;
  try {
    return NextResponse.json(lineClickSummary(days), { headers: HEADERS });
  } catch {
    return empty(500);
  }
}
