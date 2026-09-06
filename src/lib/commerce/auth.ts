import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import { normalizePhone } from "./phone";
import { otpSender } from "@/lib/otp/sender";
import { createSession } from "./session";
import { OTP_VERIFICATION_ENABLED } from "./otp-mode";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const MAX_REQUESTS_PER_HOUR = 5;

// Salted (architecture review, 2026-09-02 — see migrations/0002_otp_salt.sql for why). The real
// defense against brute force is rate-limiting + expiry + the attempt cap below, not hash
// slowness — a 6-digit code's keyspace is small enough that even a slow hash wouldn't meaningfully
// resist ONLINE guessing, which is already capped at MAX_VERIFY_ATTEMPTS. The salt's job is
// narrower: make the stored hash useless to precompute against if the table is ever read directly.
function hashCode(code: string, salt: string): string {
  return crypto.createHash("sha256").update(salt).update(code).digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "hex");
  const bufB = Buffer.from(b, "hex");
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export type RequestOtpResult = { ok: true } | { ok: false; error: "invalid-phone" | "rate-limited" };

/** Step 1 of phone-first identity: issue a one-time code. Delivery goes through the pluggable
 *  `otpSender` (see src/lib/otp/sender.ts) — today that's a console-log stub, since no real SMS
 *  provider/credentials exist (docs/BUSINESS_SOURCE_OF_TRUTH.md §19). */
export async function requestOtp(rawPhone: string): Promise<RequestOtpResult> {
  const phone = normalizePhone(rawPhone);
  if (!phone) return { ok: false, error: "invalid-phone" };
  // Verification is switched off (owner 2026-09-06) — issuing a code nobody can receive would only
  // fill the challenge table and hand the customer a dead end. Callers use `signInWithoutOtp`.
  if (!OTP_VERIFICATION_ENABLED) return { ok: true };

  const db = getDb();
  const recent = db
    .prepare(`SELECT COUNT(*) as n FROM otp_challenges WHERE phone = ? AND created_at > datetime('now', '-1 hour')`)
    .get(phone) as { n: number };
  if (recent.n >= MAX_REQUESTS_PER_HOUR) return { ok: false, error: "rate-limited" };

  const code = crypto.randomInt(100000, 1000000).toString();
  const salt = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date(Date.now() + OTP_TTL_MS).toISOString();
  db.prepare("INSERT INTO otp_challenges (phone, code_hash, salt, expires_at) VALUES (?, ?, ?, ?)").run(
    phone,
    hashCode(code, salt),
    salt,
    expiresAt
  );

  await otpSender.send(phone, code);
  return { ok: true };
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; error: "invalid-phone" | "no-pending-code" | "expired" | "too-many-attempts" | "incorrect-code" };

/** Step 2: consume the code, find-or-create the customer record, and open a session. Never
 *  reveals *why* a code was wrong beyond the error tag — no username-enumeration-style detail. */
export async function verifyOtp(rawPhone: string, code: string): Promise<VerifyOtpResult> {
  const phone = normalizePhone(rawPhone);
  if (!phone) return { ok: false, error: "invalid-phone" };
  // Nothing was ever issued while verification is off, so an old bookmarked code step must not be
  // able to sit here failing forever — treat it as the same "sign in by phone" path.
  if (!OTP_VERIFICATION_ENABLED) {
    const result = await signInWithoutOtp(rawPhone);
    return result.ok ? { ok: true } : { ok: false, error: "invalid-phone" };
  }

  const db = getDb();
  const challenge = db
    .prepare(
      `SELECT id, code_hash, salt, expires_at, attempt_count FROM otp_challenges
       WHERE phone = ? AND consumed_at IS NULL ORDER BY id DESC LIMIT 1`
    )
    .get(phone) as { id: number; code_hash: string; salt: string; expires_at: string; attempt_count: number } | undefined;

  if (!challenge) return { ok: false, error: "no-pending-code" };
  if (new Date(challenge.expires_at).getTime() < Date.now()) return { ok: false, error: "expired" };
  if (challenge.attempt_count >= MAX_VERIFY_ATTEMPTS) return { ok: false, error: "too-many-attempts" };

  if (!timingSafeEqual(hashCode(code, challenge.salt), challenge.code_hash)) {
    db.prepare("UPDATE otp_challenges SET attempt_count = attempt_count + 1 WHERE id = ?").run(challenge.id);
    return { ok: false, error: "incorrect-code" };
  }

  db.prepare("UPDATE otp_challenges SET consumed_at = datetime('now') WHERE id = ?").run(challenge.id);

  let customer = db.prepare("SELECT id FROM customers WHERE phone = ?").get(phone) as { id: number } | undefined;
  if (!customer) {
    const result = db.prepare("INSERT INTO customers (phone) VALUES (?)").run(phone);
    customer = { id: Number(result.lastInsertRowid) };
  }

  await createSession(customer.id);
  return { ok: true };
}

export type SignInWithoutOtpResult = { ok: true } | { ok: false; error: "invalid-phone" | "otp-enabled" };

/**
 * Phone-only sign-in used while `OTP_VERIFICATION_ENABLED` is false (owner 2026-09-06). Same
 * find-or-create-customer + open-session tail as `verifyOtp`, minus the code check — deliberately
 * refuses to run when verification is switched back on, so this can never become a silent bypass.
 */
export async function signInWithoutOtp(rawPhone: string): Promise<SignInWithoutOtpResult> {
  if (OTP_VERIFICATION_ENABLED) return { ok: false, error: "otp-enabled" };

  const phone = normalizePhone(rawPhone);
  if (!phone) return { ok: false, error: "invalid-phone" };

  const db = getDb();
  let customer = db.prepare("SELECT id FROM customers WHERE phone = ?").get(phone) as { id: number } | undefined;
  if (!customer) {
    const result = db.prepare("INSERT INTO customers (phone) VALUES (?)").run(phone);
    customer = { id: Number(result.lastInsertRowid) };
  }

  await createSession(customer.id);
  return { ok: true };
}
