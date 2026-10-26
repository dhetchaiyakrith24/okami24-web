import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { getDb } from "@/lib/db/client";

/**
 * Staff access for the slip-check page (owner ruling 2026-10-07, docs/BUSINESS_SOURCE_OF_TRUTH.md §9):
 * ONE shared staff password, set by the owner in the host's secret settings as `OKAMI24_STAFF_PASSWORD`
 * — never in git, chat or a log. Same session model as the customer side (src/lib/commerce/session.ts):
 * the cookie carries an opaque random token, everything else lives in `staff_sessions`.
 *
 * While the password is unset (or too short to be a password) the whole /staff area answers 404, so
 * deploying this before the owner has chosen one exposes nothing.
 */

const COOKIE = "okami24_staff";
/** The cookie is only ever sent to /staff URLs — the shop pages never see it. */
const COOKIE_PATH = "/staff";
/** Long enough for a working day's shift, short enough that a lost phone is logged out by tomorrow. */
export const STAFF_SESSION_HOURS = 12;
const MIN_PASSWORD_LENGTH = 8;

/** Slow guessing down: 5 wrong passwords from one address in 15 minutes locks that address for the rest
 *  of the window; 30 wrong passwords from anywhere lock the form for everyone (an attacker can change
 *  address, the shop's staff are a handful of people). */
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

export function staffAreaEnabled(): boolean {
  return configuredPassword() !== null;
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

export type LoginResult = { ok: true } | { ok: false; reason: "wrong" | "locked"; retryMinutes?: number };

export async function staffLogin(given: string): Promise<LoginResult> {
  const expected = configuredPassword();
  if (!expected) return { ok: false, reason: "wrong" };

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

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + STAFF_SESSION_HOURS * 3_600_000);
  db.prepare("DELETE FROM staff_sessions WHERE expires_at < ? OR revoked_at IS NOT NULL").run(new Date().toISOString());
  db.prepare("INSERT INTO staff_sessions (token_hash, password_tag, expires_at) VALUES (?, ?, ?)").run(
    sha256(token),
    passwordTag(expected),
    expiresAt.toISOString()
  );
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "lax", not "strict": staff open the page from a link in LINE, and a strict cookie is not sent on
    // that first cross-site navigation — they would be asked for the password every time. Lax is still
    // never sent on a cross-site POST, and Server Actions check the Origin themselves.
    sameSite: "lax",
    expires: expiresAt,
    path: COOKIE_PATH,
  });
  return { ok: true };
}

export async function staffLogout(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    getDb().prepare("UPDATE staff_sessions SET revoked_at = ? WHERE token_hash = ?").run(new Date().toISOString(), sha256(token));
  }
  store.delete({ name: COOKIE, path: COOKIE_PATH });
}

/** True when this request carries a live staff session opened with the CURRENT password. Every staff
 *  page render and every staff API call goes through here — rendering the form only when logged in is
 *  not a security boundary on its own. */
export const isStaff = cache(async (): Promise<boolean> => {
  const expected = configuredPassword();
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  const row = getDb()
    .prepare("SELECT password_tag, expires_at, revoked_at FROM staff_sessions WHERE token_hash = ?")
    .get(sha256(token)) as { password_tag: string; expires_at: string; revoked_at: string | null } | undefined;
  if (!row || row.revoked_at) return false;
  if (Date.parse(row.expires_at) <= Date.now()) return false;
  return row.password_tag === passwordTag(expected);
});
