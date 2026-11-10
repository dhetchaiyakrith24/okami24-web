import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import type { NextResponse } from "next/server";
import { cache } from "react";
import { getDb } from "@/lib/db/client";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { enabledMemberProviders } from "@/lib/members/providers";
import { ownerAreaEnabled, ownerEmailSetting } from "@/lib/owner/auth";
import { isOwnerIdentity } from "@/lib/owner/identity";
import { decideStaffSignIn, OWNER_NAME, SHARED_NAME, type SignInClaims, type StaffActor } from "@/lib/staff/account-rules";
import { accountForSignIn, markSignedIn } from "@/lib/staff/accounts";
import { recordStaffAction } from "@/lib/staff/audit";
import { TEAM_MARKER_COOKIE } from "@/lib/staff/team-marker";

/**
 * Who may open /staff. Two ways in, one session table (`staff_sessions`, the cookie carries an opaque random token):
 *  - **Google, per person** (owner 10/11 chat: "admin แต่ละคนมีบัญชีของตัวเอง"): an active account in `staff_accounts`
 *    (src/lib/staff/accounts.ts, managed by the owner on /staff/owner/team), or the owner's own address — the owner then acts
 *    in the admin view under the name "เจ้าของ". Same verified Google flow as the owner's section (email_verified, PKCE, state,
 *    nonce — src/lib/members/providers.ts), purpose "staff".
 *  - **The shared team password** (owner ruling 2026-10-07, BSOT §9): `OKAMI24_STAFF_PASSWORD` on the host, never in git, chat
 *    or a log. Kept as the fallback until every admin has signed in with Google; the owner's switch "ปิดรหัสร่วม"
 *    (shop-switches `staffPasswordOff`) then closes it and ends every session it opened.
 * Every session names its person (`currentStaff`), and "ใครทำอะไร" records it (src/lib/staff/audit.ts).
 *
 * While neither way is configured the whole /staff area answers 404.
 */

const COOKIE = "okami24_staff";
/** The cookie is only ever sent to /staff URLs — the shop pages never see it. */
const COOKIE_PATH = "/staff";
/** Long enough for a working day's shift, short enough that a lost phone is logged out by tomorrow. */
export const STAFF_SESSION_HOURS = 12;
/** The owner's own sessions follow the owner's section (src/lib/owner/auth.ts: 14 days). */
const OWNER_SESSION_HOURS = 14 * 24;
const MIN_PASSWORD_LENGTH = 8;
/** Stored in `password_tag` of a session that no password opened. */
const GOOGLE_TAG = "google";

/** Slow guessing down: 5 wrong passwords from one address in 15 minutes locks that address for the rest
 *  of the window; 30 wrong passwords from anywhere lock the password form for everyone. Google sign-in never meets this
 *  lock, so a script hammering the form can no longer keep the admins out (security findings 09/11 item 3). */
const WINDOW_MINUTES = 15;
const MAX_FAILURES_PER_CLIENT = 5;
const MAX_FAILURES_TOTAL = 30;

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function configuredPassword(): string | null {
  const value = process.env.OKAMI24_STAFF_PASSWORD?.trim() ?? "";
  return value.length >= MIN_PASSWORD_LENGTH ? value : null;
}

/** The shared password opens /staff: set on the host and not switched off by the owner. */
export function sharedPasswordOpen(): boolean {
  return configuredPassword() !== null && !readSwitches().staffPasswordOff;
}

/** Google sign-in for the team: the same Google setup the members' and the owner's sign-in use. */
export function googleStaffSignIn(): boolean {
  return enabledMemberProviders().includes("google");
}

export function staffAreaEnabled(): boolean {
  return configuredPassword() !== null || googleStaffSignIn();
}

function passwordTag(password: string): string {
  return sha256(`okami24-staff:${password}`).slice(0, 16);
}

function passwordMatches(given: string, expected: string): boolean {
  // Compare fixed-length digests so neither the length nor the content leaks through timing.
  const a = crypto.createHash("sha256").update(given, "utf8").digest();
  const b = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(a, b);
}

async function clientHash(): Promise<string> {
  const h = await headers();
  // Cloudflare sits in front of the site and names the visitor in CF-Connecting-IP. Without it, the RIGHTMOST
  // X-Forwarded-For entry (a proxy appended it) — never the leftmost, which the caller writes and could change per try to
  // dodge the per-visitor lock; same rule as src/lib/commerce/phone-rate-limit.ts (owner 26/10 "แก้เลย").
  const ip =
    h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? h.get("x-real-ip") ?? "unknown";
  return sha256(`okami24-staff-client:${ip}`);
}

type CookieSink = { set: NextResponse["cookies"]["set"] };

/** Opens a session for `actor` and puts its cookie (plus the shop's "ทีมงาน" marker) on `sink` — the request's cookie store in
 *  a Server Action, or the redirect response of the sign-in callback. */
function issueSession(sink: CookieSink, actor: StaffActor, tag: string, hours: number): void {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + hours * 3_600_000);
  const db = getDb();
  db.prepare("DELETE FROM staff_sessions WHERE expires_at < ? OR revoked_at IS NOT NULL").run(new Date().toISOString());
  db.prepare("INSERT INTO staff_sessions (token_hash, password_tag, expires_at, actor_kind, staff_id) VALUES (?, ?, ?, ?, ?)").run(
    sha256(token),
    tag,
    expiresAt.toISOString(),
    actor.kind,
    actor.accountId
  );
  sink.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "lax", not "strict": staff open the page from a link in LINE, and a strict cookie is not sent on
    // that first cross-site navigation — they would be asked to sign in every time. Lax is still
    // never sent on a cross-site POST, and Server Actions check the Origin themselves.
    sameSite: "lax",
    expires: expiresAt,
    path: COOKIE_PATH,
  });
  // The marker the shop pages read to show the "ทีมงาน" button (owner 30/10) — readable by the browser on purpose, same lifetime.
  sink.set(TEAM_MARKER_COOKIE, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export type LoginResult = { ok: true } | { ok: false; reason: "wrong" | "locked"; retryMinutes?: number };

export async function staffLogin(given: string): Promise<LoginResult> {
  const expected = configuredPassword();
  if (!expected || !sharedPasswordOpen()) return { ok: false, reason: "wrong" };

  const db = getDb();
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  db.prepare("DELETE FROM staff_login_failures WHERE failed_at < ?").run(since);

  const client = await clientHash();
  const mine = db
    .prepare("SELECT COUNT(*) AS n, MIN(failed_at) AS first FROM staff_login_failures WHERE client_hash = ?")
    .get(client) as { n: number; first: string | null };
  const total = (db.prepare("SELECT COUNT(*) AS n FROM staff_login_failures").get() as { n: number }).n;
  if (mine.n >= MAX_FAILURES_PER_CLIENT || total >= MAX_FAILURES_TOTAL) {
    const first = mine.first ? Date.parse(mine.first) : Date.now();
    const retryMinutes = Math.max(1, Math.ceil((first + WINDOW_MINUTES * 60_000 - Date.now()) / 60_000));
    return { ok: false, reason: "locked", retryMinutes };
  }

  if (!passwordMatches(given, expected)) {
    db.prepare("INSERT INTO staff_login_failures (client_hash) VALUES (?)").run(client);
    // A small fixed pause makes scripted guessing slower without bothering a person.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: false, reason: "wrong" };
  }

  const actor: StaffActor = { kind: "shared", accountId: null, name: SHARED_NAME };
  issueSession(await cookies(), actor, passwordTag(expected), STAFF_SESSION_HOURS);
  recordStaffAction(actor, "sign-in", { detail: "รหัสร่วม" });
  return { ok: true };
}

/**
 * The end of a Google sign-in whose purpose was "staff" (src/app/api/auth/[provider]/callback/route.ts). Returns who signed in,
 * or why not (the reason goes to the server log only — never the address). The session cookie goes on `response`.
 */
export function finishStaffGoogleSignIn(claims: SignInClaims, response: NextResponse): { ok: true; actor: StaffActor } | { ok: false; reason: string } {
  const owner = ownerAreaEnabled() ? ownerEmailSetting() : null;
  const decision = decideStaffSignIn(
    claims,
    (email) => isOwnerIdentity({ email, emailVerified: true }, owner),
    claims.email ? accountForSignIn(claims.email) : null
  );
  if (!decision.ok) return { ok: false, reason: decision.reason };
  const { actor } = decision;
  issueSession(response.cookies, actor, GOOGLE_TAG, actor.kind === "owner" ? OWNER_SESSION_HOURS : STAFF_SESSION_HOURS);
  if (actor.accountId !== null) markSignedIn(actor.accountId, claims.sub, decision.pinSub);
  recordStaffAction(actor, "sign-in", { detail: "Google" });
  return { ok: true, actor };
}

/** The owner, already signed in to /staff/owner, steps into the admin view ("มุมแอดมิน") without signing in again. The caller
 *  has checked isOwner(). */
export async function openOwnerStaffSession(): Promise<void> {
  if ((await currentStaff())?.kind === "owner") return;
  issueSession(await cookies(), { kind: "owner", accountId: null, name: OWNER_NAME }, GOOGLE_TAG, OWNER_SESSION_HOURS);
}

export async function staffLogout(): Promise<void> {
  const actor = await currentStaff();
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    getDb().prepare("UPDATE staff_sessions SET revoked_at = ? WHERE token_hash = ?").run(new Date().toISOString(), sha256(token));
  }
  if (actor) recordStaffAction(actor, "sign-out");
  store.delete({ name: COOKIE, path: COOKIE_PATH });
  store.delete({ name: TEAM_MARKER_COOKIE, path: "/" });
}

interface SessionRow {
  password_tag: string;
  expires_at: string;
  revoked_at: string | null;
  actor_kind: StaffActor["kind"];
  staff_id: number | null;
  account_name: string | null;
  account_active: number | null;
}

/**
 * Who this request is in the back office, or null. Every staff page render and every staff API call goes through here (or
 * `isStaff`) — rendering the form only when logged in is not a security boundary on its own. Checked live on each request:
 * a disabled account, the owner's setting removed, or the shared password changed or switched off ends the session at once.
 */
export const currentStaff = cache(async (): Promise<StaffActor | null> => {
  if (!staffAreaEnabled()) return null;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const row = getDb()
    .prepare(
      `SELECT s.password_tag, s.expires_at, s.revoked_at, s.actor_kind, s.staff_id, a.name AS account_name, a.active AS account_active
       FROM staff_sessions s LEFT JOIN staff_accounts a ON a.id = s.staff_id WHERE s.token_hash = ?`
    )
    .get(sha256(token)) as SessionRow | undefined;
  if (!row || row.revoked_at) return null;
  if (Date.parse(row.expires_at) <= Date.now()) return null;
  if (row.actor_kind === "shared") {
    const expected = configuredPassword();
    if (!expected || !sharedPasswordOpen() || row.password_tag !== passwordTag(expected)) return null;
    return { kind: "shared", accountId: null, name: SHARED_NAME };
  }
  if (row.actor_kind === "owner") return ownerAreaEnabled() ? { kind: "owner", accountId: null, name: OWNER_NAME } : null;
  if (row.staff_id === null || row.account_active !== 1 || !row.account_name) return null;
  return { kind: "account", accountId: row.staff_id, name: row.account_name };
});

/** True when this request carries a live staff session of any kind. */
export const isStaff = cache(async (): Promise<boolean> => (await currentStaff()) !== null);

/** The owner switched the shared password off (/staff/owner/team): every session it opened ends now, for good — switching it
 *  on again later needs the password typed again. Returns how many were open. */
export function endSharedSessions(): number {
  return getDb()
    .prepare("UPDATE staff_sessions SET revoked_at = ? WHERE actor_kind = 'shared' AND revoked_at IS NULL")
    .run(new Date().toISOString()).changes;
}

/** The owner signed out of the owner's section: the owner's session in the admin view ends with it. */
export async function endOwnerStaffSession(): Promise<void> {
  if ((await currentStaff())?.kind !== "owner") return;
  await staffLogout();
}
