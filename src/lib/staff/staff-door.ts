/**
 * The back office's outer door (outside tester Test 2, T2-52): run by src/proxy.ts before any /staff page renders. Pure, so the
 * contract test runs it under plain tsx (staff-gate-contract-test.ts).
 *
 * Why: every staff page checks the server session itself and sends a visitor without one to the sign-in, but the staff pages
 * stream (src/app/staff/loading.tsx), so that page-level redirect left as an in-page instruction under HTTP 200. This door
 * answers a real 307 first when the request does not even carry the cookie a session needs. It only looks at whether the
 * cookie is there — whose session it is, and whether it is still live, stays the page's and the action's own check
 * (src/lib/staff/auth.ts `currentStaff` · src/lib/owner/auth.ts `isOwner`); the readable team marker cookie (team-marker.ts)
 * counts for nothing here (T2-16).
 *
 * Left open on purpose: /staff and /staff/owner themselves (the sign-in forms — the shared password posts to /staff, the Google
 * return lands on them), and the staff API routes, which answer 404 themselves without a session.
 */
export const STAFF_COOKIE = "okami24_staff";
export const OWNER_COOKIE = "okami24_owner";

/** Where to send this request, or null = let it through to the page's own check. */
export function staffDoor(pathname: string, has: { staff: boolean; owner: boolean }): string | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/staff" || p === "/staff/owner") return null;
  if (!p.startsWith("/staff/")) return null;
  if (p.startsWith("/staff/api/") || /^\/staff\/orders\/[^/]+\/(slip-image|refund-slip)$/.test(p)) return null;
  if (p.startsWith("/staff/owner/")) return has.owner ? null : "/staff/owner";
  return has.staff ? null : "/staff";
}
