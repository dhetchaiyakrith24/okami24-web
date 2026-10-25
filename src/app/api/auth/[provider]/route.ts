import { NextResponse, type NextRequest } from "next/server";
import { beginSignIn, isMemberProvider } from "@/lib/members/providers";
import { setPendingCookie } from "@/lib/members/pending-cookie";
import { safeReturnPath } from "@/lib/members/id-token";

/**
 * Member sign-in, step 1 (queue Q4): /api/auth/line or /api/auth/google → the provider's consent screen.
 * `?next=/path` = where to land afterwards (same-site paths only). A provider that is not configured answers 404.
 */
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }): Promise<NextResponse> {
  const { provider } = await params;
  if (!isMemberProvider(provider)) return new NextResponse(null, { status: 404, headers: HEADERS });
  const started = beginSignIn(provider, safeReturnPath(request.nextUrl.searchParams.get("next")));
  if (!started) return new NextResponse(null, { status: 404, headers: HEADERS });
  const response = NextResponse.redirect(started.url, { status: 302, headers: HEADERS });
  setPendingCookie(response, started.pending);
  return response;
}
