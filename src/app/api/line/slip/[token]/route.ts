import { NextResponse, type NextRequest } from "next/server";
import { slipImageByToken } from "@/lib/commerce/slip-images";

/**
 * GET /api/line/slip/<token>[?preview=1] — the slip picture LINE fetches for the bot's order alert in the
 * "OKM Webside order" group (owner 26/10, queue B2 (c)). A LINE image message must name a public HTTPS address, so the
 * address itself is the key: a 32-character random token per picture (src/lib/commerce/slip-images.ts), never linked
 * anywhere else, gone when the picture is deleted after 90 days. Unknown or malformed = 404, the same as a deleted one.
 * Never cached by a shared cache, never indexed.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" } as const;

export async function GET(request: NextRequest, context: { params: Promise<{ token: string }> }): Promise<NextResponse> {
  const { token } = await context.params;
  const file = slipImageByToken(token, request.nextUrl.searchParams.get("preview") === "1");
  if (!file) return new NextResponse(null, { status: 404, headers: HEADERS });
  return new NextResponse(new Uint8Array(file), { status: 200, headers: { ...HEADERS, "Content-Type": "image/jpeg" } });
}
