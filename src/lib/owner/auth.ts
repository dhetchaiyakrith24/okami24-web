import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { getDb } from "@/lib/db/client";
import { enabledMemberProviders } from "@/lib/members/providers";

/**
 * The owner's section, /staff/owner (back-office round 07/11, batch 3). Owner 04/11: cost and profit are the owner's alone.
 * Apart from the staff password on purpose: the staff cookie opens nothing here, and this cookie opens nothing else.
 *
 * Who the owner is = one setting on the host, `OKAMI24_OWNER_GOOGLE_EMAIL`, never in git. Until it is set, and while Google
 * sign-in is not configured, the whole section answers 404, so deploying this exposes nothing. Removing the setting closes
 * the section at once, sessions included. The address is compared at sign-in and never stored.
 */
const COOKIE = "okami24_owner";
/** The cookie is only ever sent to the owner's own pages. */
const COOKIE_PATH = "/staff/owner";
/** The owner reads this from a phone every day; a lost phone is a tap on "ออกจากระบบ" from another device away from the next fix. */
const SESSION_DAYS = 14;

const sha256 = (text: string) => crypto.createHash("sha256").update(text).digest("hex");

export function ownerEmailSetting(): string | null {
  return process.env.OKAMI24_OWNER_GOOGLE_EMAIL?.trim() || null;
}

export function ownerAreaEnabled(): boolean {
  return ownerEmailSetting() !== null && enabledMemberProviders().includes("google");
}

/** Called from the sign-in callback, which answers with a redirect, so the cookie goes on that response itself. */
export function createOwnerSession(response: NextResponse): void {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const db = getDb();
  db.prepare("DELETE FROM owner_sessions WHERE expires_at < ? OR revoked_at IS NOT NULL").run(new Date().toISOString());
  db.prepare("INSERT INTO owner_sessions (token_hash, expires_at) VALUES (?, ?)").run(sha256(token), expiresAt.toISOString());
  response.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax, like the staff cookie: the owner lands here from Google and from links in LINE.
    sameSite: "lax",
    expires: expiresAt,
    path: COOKIE_PATH,
  });
}

/** True when this request carries a live owner session. Every owner page and action goes through here. */
export const isOwner = cache(async (): Promise<boolean> => {
  if (!ownerAreaEnabled()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const row = getDb().prepare("SELECT expires_at, revoked_at FROM owner_sessions WHERE token_hash = ?").get(sha256(token)) as
    | { expires_at: string; revoked_at: string | null }
    | undefined;
  return Boolean(row && !row.revoked_at && Date.parse(row.expires_at) > Date.now());
});

/** First line of every owner page below /staff/owner. */
export async function requireOwner(): Promise<void> {
  if (!ownerAreaEnabled()) notFound();
  if (!(await isOwner())) redirect("/staff/owner");
}

export async function ownerLogout(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) getDb().prepare("UPDATE owner_sessions SET revoked_at = ? WHERE token_hash = ?").run(new Date().toISOString(), sha256(token));
  store.delete({ name: COOKIE, path: COOKIE_PATH });
}
