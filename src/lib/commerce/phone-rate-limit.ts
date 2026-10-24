import "server-only";
import crypto from "node:crypto";
import { headers } from "next/headers";

/**
 * Rate limit for the two places a phone number alone opens a customer's session (owner 24/10 proposal ⑤, approved):
 * "ติดตามคำสั่งซื้อ" (/orders) and the checkout phone step while OTP is off. Without it, a script could walk through phone
 * numbers and read whoever has orders or saved addresses. A person typing their own number never meets it.
 *
 * Per visitor: MAX_PER_CLIENT attempts per WINDOW_MS, plus a shop-wide ceiling for when the visitor header cannot be
 * trusted (a request sent to the host directly, not through Cloudflare). In memory on purpose: one server process, and a
 * deploy resetting the counts is harmless — the point is to make walking the number space slow, not to keep a ledger.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_CLIENT = 10;
const MAX_TOTAL = 300;

declare global {
  var __okami24PhoneAttempts: Map<string, number[]> | undefined;
}

function attempts(): Map<string, number[]> {
  globalThis.__okami24PhoneAttempts ??= new Map();
  return globalThis.__okami24PhoneAttempts;
}

async function clientKey(): Promise<string> {
  const h = await headers();
  // Same visitor header as the staff login (src/lib/staff/auth.ts): Cloudflare names the visitor in CF-Connecting-IP.
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
  return crypto.createHash("sha256").update(`okami24-phone:${ip}`).digest("hex").slice(0, 32);
}

/** Records one attempt and says whether it may go ahead. Call it before looking the number up. */
export async function allowPhoneAttempt(): Promise<boolean> {
  const now = Date.now();
  const since = now - WINDOW_MS;
  const map = attempts();
  let total = 0;
  for (const [key, times] of map) {
    const fresh = times.filter((t) => t > since);
    if (fresh.length === 0) map.delete(key);
    else {
      map.set(key, fresh);
      total += fresh.length;
    }
  }
  const key = await clientKey();
  const mine = map.get(key) ?? [];
  if (mine.length >= MAX_PER_CLIENT || total >= MAX_TOTAL) return false;
  mine.push(now);
  map.set(key, mine);
  return true;
}
