import "server-only";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { cache } from "react";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import type { MemberProvider } from "./providers";

/**
 * Member sessions (queue Q4, owner 26/10) — the same database-session pattern as src/lib/commerce/session.ts: the cookie
 * carries an opaque random token, only its SHA-256 is stored, no signing secret exists. A separate cookie and table on
 * purpose (see migrations/0016_members.sql): the checkout phone session proves nothing about who the visitor is, a member
 * session proves a LINE or Google sign-in.
 */
const MEMBER_COOKIE = "okami24_member";
const MEMBER_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface MemberRecord {
  id: number;
  displayName: string | null;
  /** The provider of THIS session — the member page says "เข้าสู่ระบบด้วย LINE / Google". */
  provider: MemberProvider;
}

/**
 * Finds the member behind a provider identity, or creates one on the first sign-in ("ครั้งแรกระบบสร้างบัญชีให้ทันที").
 * The display name is refreshed on every sign-in so a renamed LINE / Google account shows its current name.
 */
export function upsertMemberFromIdentity(provider: MemberProvider, subject: string, displayName: string | null): number {
  const db = getDb();
  const name = displayName?.trim().slice(0, 80) || null;
  const run = db.transaction(() => {
    const found = db
      .prepare("SELECT member_id FROM member_identities WHERE provider = ? AND subject = ?")
      .get(provider, subject) as { member_id: number } | undefined;
    if (found) {
      db.prepare("UPDATE members SET display_name = COALESCE(?, display_name), last_sign_in_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(
        name,
        found.member_id,
      );
      return found.member_id;
    }
    const created = db
      .prepare("INSERT INTO members (display_name, last_sign_in_at) VALUES (?, strftime('%Y-%m-%dT%H:%M:%fZ','now'))")
      .run(name);
    const memberId = Number(created.lastInsertRowid);
    db.prepare("INSERT INTO member_identities (member_id, provider, subject) VALUES (?, ?, ?)").run(memberId, provider, subject);
    return memberId;
  });
  return run();
}

/** Called from the sign-in callback route, which answers with a redirect — the cookie goes on that response itself. */
export function createMemberSession(memberId: number, provider: MemberProvider, response: NextResponse): void {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MEMBER_TTL_MS);
  getDb()
    .prepare("INSERT INTO member_sessions (member_id, provider, token_hash, expires_at) VALUES (?, ?, ?, ?)")
    .run(memberId, provider, hashToken(token), expiresAt.toISOString());

  response.cookies.set(MEMBER_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function destroyMemberSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE)?.value;
  if (token) {
    getDb()
      .prepare("UPDATE member_sessions SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE token_hash = ?")
      .run(hashToken(token));
  }
  cookieStore.delete(MEMBER_COOKIE);
}

interface MemberSessionRow {
  member_id: number;
  provider: MemberProvider;
  expires_at: string;
  revoked_at: string | null;
  display_name: string | null;
}

/** The signed-in member for this request, or null. Memoized per request like `getSession`. */
export const getMember = cache(async (): Promise<MemberRecord | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT s.member_id, s.provider, s.expires_at, s.revoked_at, m.display_name
       FROM member_sessions s JOIN members m ON m.id = s.member_id
       WHERE s.token_hash = ?`,
    )
    .get(hashToken(token)) as MemberSessionRow | undefined;

  if (!row || row.revoked_at !== null || new Date(row.expires_at).getTime() < Date.now()) return null;
  return { id: row.member_id, displayName: row.display_name, provider: row.provider };
});
