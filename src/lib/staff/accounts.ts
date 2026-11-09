import "server-only";
import { getDb } from "@/lib/db/client";
import { normalEmail, parseName, parseNewAccount, type AccountForSignIn } from "@/lib/staff/account-rules";

/**
 * The admins' accounts (migration 0028, owner 10/11). The owner adds, renames and disables them on /staff/owner/team; they sign
 * in with Google (src/lib/staff/auth.ts). The address lives only in this table on the data disk — never in a log line.
 */

export interface StaffAccount {
  id: number;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  lastSignInAt: string | null;
}

interface Row {
  id: number;
  name: string;
  email: string;
  active: number;
  google_sub: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

const toAccount = (r: Row): StaffAccount => ({
  id: r.id,
  name: r.name,
  email: r.email,
  active: r.active === 1,
  createdAt: r.created_at,
  lastSignInAt: r.last_sign_in_at,
});

export function listAccounts(): StaffAccount[] {
  return (getDb().prepare("SELECT * FROM staff_accounts ORDER BY active DESC, id").all() as Row[]).map(toAccount);
}

export function accountForSignIn(email: string): AccountForSignIn | null {
  const r = getDb().prepare("SELECT * FROM staff_accounts WHERE email = ?").get(normalEmail(email)) as Row | undefined;
  return r ? { id: r.id, name: r.name, active: r.active === 1, googleSub: r.google_sub } : null;
}

/** After a successful sign-in: the time, and Google's id the first time. */
export function markSignedIn(id: number, sub: string, pinSub: boolean): void {
  const now = new Date().toISOString();
  if (pinSub) getDb().prepare("UPDATE staff_accounts SET last_sign_in_at = ?, google_sub = ? WHERE id = ? AND google_sub IS NULL").run(now, sub, id);
  else getDb().prepare("UPDATE staff_accounts SET last_sign_in_at = ? WHERE id = ?").run(now, id);
}

export type AccountResult = { ok: true; id: number; name: string } | { ok: false; error: "name" | "email" | "taken" | "missing" };

export function addAccount(nameRaw: unknown, emailRaw: unknown): AccountResult {
  const parsed = parseNewAccount(nameRaw, emailRaw);
  if (!parsed.ok) return parsed;
  const db = getDb();
  if (db.prepare("SELECT 1 FROM staff_accounts WHERE email = ?").get(parsed.email)) return { ok: false, error: "taken" };
  const info = db.prepare("INSERT INTO staff_accounts (name, email) VALUES (?, ?)").run(parsed.name, parsed.email);
  return { ok: true, id: Number(info.lastInsertRowid), name: parsed.name };
}

export function renameAccount(id: number, nameRaw: unknown): AccountResult {
  const name = parseName(nameRaw);
  if (!name) return { ok: false, error: "name" };
  const info = getDb().prepare("UPDATE staff_accounts SET name = ? WHERE id = ?").run(name, id);
  return info.changes === 1 ? { ok: true, id, name } : { ok: false, error: "missing" };
}

/** Disabling ends the person's open sessions at once; enabling lets them sign in again. Nothing is deleted (history keeps the name). */
export function setAccountActive(id: number, active: boolean): AccountResult {
  const db = getDb();
  const row = db.prepare("SELECT name FROM staff_accounts WHERE id = ?").get(id) as { name: string } | undefined;
  if (!row) return { ok: false, error: "missing" };
  db.transaction(() => {
    db.prepare("UPDATE staff_accounts SET active = ? WHERE id = ?").run(active ? 1 : 0, id);
    if (!active) db.prepare("UPDATE staff_sessions SET revoked_at = ? WHERE account_id = ? AND revoked_at IS NULL").run(new Date().toISOString(), id);
  })();
  return { ok: true, id, name: row.name };
}
