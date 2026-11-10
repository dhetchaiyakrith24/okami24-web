import { NextResponse } from "next/server";
import { beginSignIn } from "@/lib/members/providers";
import { setPendingCookie } from "@/lib/members/pending-cookie";
import { googleStaffSignIn } from "@/lib/staff/auth";

/**
 * The team's sign-in, step 1 (owner 10/11: each admin with their own Google account): Google's consent screen with
 * `openid email`. It comes back through /api/auth/google/callback marked "staff"; the callback compares the address with the
 * admins' accounts (and the owner's setting) and opens a /staff session. 404 while Google sign-in is not configured.
 */
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

export async function GET(): Promise<NextResponse> {
  if (!googleStaffSignIn()) return new NextResponse(null, { status: 404, headers: HEADERS });
  const started = beginSignIn("google", "/staff", "staff");
  if (!started) return new NextResponse(null, { status: 404, headers: HEADERS });
  const response = NextResponse.redirect(started.url, { status: 302, headers: HEADERS });
  setPendingCookie(response, started.pending);
  return response;
}
