import { NextResponse } from "next/server";
import { beginSignIn } from "@/lib/members/providers";
import { setPendingCookie } from "@/lib/members/pending-cookie";
import { ownerAreaEnabled } from "@/lib/owner/auth";

/**
 * The owner's sign-in, step 1 (back-office round 07/11): Google's consent screen with `openid email`, the one sign-in that
 * asks for an address. It comes back through the same /api/auth/google/callback as members, marked as the owner's, and the
 * callback compares the address and stores nothing. 404 until the section is switched on.
 */
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(): Promise<NextResponse> {
  if (!ownerAreaEnabled()) return new NextResponse(null, { status: 404, headers: HEADERS });
  const started = beginSignIn("google", "/staff/owner", "owner");
  if (!started) return new NextResponse(null, { status: 404, headers: HEADERS });
  const response = NextResponse.redirect(started.url, { status: 302, headers: HEADERS });
  setPendingCookie(response, started.pending);
  return response;
}
