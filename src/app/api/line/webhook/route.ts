import { after, NextResponse, type NextRequest } from "next/server";
import { lineConfigured, validSignature } from "@/lib/line/client";
import { handleEvents, type LineEvent } from "@/lib/line/webhook";

/**
 * POST /api/line/webhook — the alert bot "OKM ORDER"'s webhook URL (set by the owner in LINE Developers Console;
 * cart round 22/10). 404 until the owner has put the channel secret + access token in the host's settings. Every
 * request must carry a valid `x-line-signature` (HMAC-SHA256 of the raw body with the channel secret,
 * developers.line.biz/en/docs/messaging-api/verify-webhook-signature/) — anything else is a 401 and is not read.
 * The answer is sent at once; the events are handled after it (`after`), so a slow slip check never makes LINE retry.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!lineConfigured()) return new NextResponse(null, { status: 404 });
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-line-signature"))) return new NextResponse(null, { status: 401 });

  let events: LineEvent[] = [];
  try {
    const body = JSON.parse(raw) as { events?: LineEvent[] };
    events = Array.isArray(body.events) ? body.events : [];
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  // The console's "Verify" button sends an empty list — 200 is the whole answer.
  if (events.length > 0) after(() => handleEvents(events));
  return new NextResponse(null, { status: 200 });
}
