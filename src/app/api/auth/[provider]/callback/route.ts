import { NextResponse, type NextRequest } from "next/server";
import { authOrigin, finishSignIn, isMemberProvider } from "@/lib/members/providers";
import { clearPendingCookie, PENDING_COOKIE, readPendingCookie } from "@/lib/members/pending-cookie";
import { createMemberSession, upsertMemberFromIdentity } from "@/lib/members/session";
import { safeReturnPath } from "@/lib/members/id-token";
import { createOwnerSession, ownerEmailSetting } from "@/lib/owner/auth";
import { isOwnerIdentity } from "@/lib/owner/identity";
import { finishStaffGoogleSignIn } from "@/lib/staff/auth";

/**
 * Member sign-in, step 2 (queue Q4): the provider sends the visitor back here with `code` + `state`. The state must equal
 * the one in this browser's pending cookie; the code is traded server-side for the ID token (src/lib/members/providers.ts).
 * Success → member session cookie + back to where the visitor started. Anything else (cancelled on the consent screen,
 * expired cookie, bad token) → the login page with a short "try again" line; the reason goes to the server log only.
 */
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

type Purpose = "member" | "owner" | "staff";
const DENIED: Record<Purpose, string> = { member: "/account/login?error=1", owner: "/staff/owner?denied=1", staff: "/staff?denied=1" };

function toLogin(reason: string, provider: string, purpose: Purpose = "member"): NextResponse {
  console.warn(`[${purpose}-sign-in] ${provider}: ${reason}`);
  const response = NextResponse.redirect(`${authOrigin()}${DENIED[purpose]}`, { status: 302, headers: HEADERS });
  clearPendingCookie(response);
  return response;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ provider: string }> }): Promise<NextResponse> {
  const { provider } = await params;
  if (!isMemberProvider(provider)) return new NextResponse(null, { status: 404, headers: HEADERS });

  const query = request.nextUrl.searchParams;
  const pending = readPendingCookie(request.cookies.get(PENDING_COOKIE)?.value);
  const purpose: Purpose = pending?.purpose ?? "member";
  if (query.get("error")) return toLogin(`provider error ${query.get("error")}`, provider, purpose);
  if (!pending || pending.provider !== provider) return toLogin("no pending sign-in", provider);
  const code = query.get("code");
  if (!code || query.get("state") !== pending.state) return toLogin("state mismatch", provider, purpose);

  const result = await finishSignIn(pending, code);
  if (!result.ok) return toLogin(result.reason, provider, purpose);

  // The owner's sign-in (src/lib/owner/auth.ts) leaves no member row, whoever it turns out to be.
  if (purpose === "owner") {
    if (provider !== "google" || !isOwnerIdentity(result.claims, ownerEmailSetting())) return toLogin("not the owner", provider, "owner");
    const toOwner = NextResponse.redirect(`${authOrigin()}/staff/owner`, { status: 302, headers: HEADERS });
    clearPendingCookie(toOwner);
    createOwnerSession(toOwner);
    return toOwner;
  }

  // The team's sign-in (src/lib/staff/auth.ts): an admin's account, or the owner acting in the admin view. No member row either.
  if (purpose === "staff") {
    if (provider !== "google") return toLogin("not google", provider, "staff");
    const toStaff = NextResponse.redirect(`${authOrigin()}/staff`, { status: 302, headers: HEADERS });
    const signedIn = finishStaffGoogleSignIn(result.claims, toStaff);
    if (!signedIn.ok) return toLogin(signedIn.reason, provider, "staff");
    clearPendingCookie(toStaff);
    // The owner signs in once: the owner's own section opens with the same sign-in.
    if (signedIn.actor.kind === "owner") createOwnerSession(toStaff);
    return toStaff;
  }

  const memberId = upsertMemberFromIdentity(provider, result.claims.sub, result.claims.name);
  // The cookie is unsigned — re-check the return path here as a second lock (checker #854 n1).
  const response = NextResponse.redirect(`${authOrigin()}${safeReturnPath(pending.returnTo)}`, { status: 302, headers: HEADERS });
  clearPendingCookie(response);
  createMemberSession(memberId, provider, response);
  return response;
}
