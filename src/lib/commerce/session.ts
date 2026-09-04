import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";

/**
 * Database sessions (not JWT) — see node_modules/next/dist/docs .../authentication.md "Database
 * Sessions" section, which this follows closely: the cookie carries only an opaque random token;
 * every fact about the session (who, when, still valid) lives server-side. No SESSION_SECRET or
 * signing key is needed anywhere, which matters here specifically because no env-var
 * infrastructure exists yet and inventing one just for this would be exactly the kind of "invent
 * a secret" the mission's explicit prohibitions rule out.
 */
const SESSION_COOKIE = "okami24_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export interface CustomerRecord {
  id: number;
  phone: string;
  displayName: string | null;
}

export async function createSession(customerId: number): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  getDb()
    .prepare("INSERT INTO sessions (customer_id, token_hash, expires_at) VALUES (?, ?, ?)")
    .run(customerId, hashToken(token), expiresAt.toISOString());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    getDb().prepare("UPDATE sessions SET revoked_at = datetime('now') WHERE token_hash = ?").run(hashToken(token));
  }
  cookieStore.delete(SESSION_COOKIE);
}

interface SessionRow {
  customer_id: number;
  expires_at: string;
  revoked_at: string | null;
  phone: string;
  display_name: string | null;
}

/**
 * The Data Access Layer entry point every Server Action / Server Component should call instead
 * of reading the cookie directly (see authentication.md "Creating a Data Access Layer (DAL)").
 * React's `cache()` memoizes this per request so multiple components/actions checking the session
 * during one render/action don't each hit the database.
 */
export const getSession = cache(async (): Promise<CustomerRecord | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const row = getDb()
    .prepare(
      `SELECT s.customer_id, s.expires_at, s.revoked_at, c.phone, c.display_name
       FROM sessions s JOIN customers c ON c.id = s.customer_id
       WHERE s.token_hash = ?`
    )
    .get(hashToken(token)) as SessionRow | undefined;

  if (!row || row.revoked_at !== null || new Date(row.expires_at).getTime() < Date.now()) {
    return null;
  }
  return { id: row.customer_id, phone: row.phone, displayName: row.display_name };
});

/** Throws rather than returning null — use only where the caller has no valid unauthenticated
 *  path (e.g. address book, order history). Checkout itself must NOT use this: a guest can start
 *  checkout before verifying their phone. */
export async function requireCustomer(): Promise<CustomerRecord> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated.");
  return session;
}
