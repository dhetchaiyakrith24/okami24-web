import "server-only";
import { getDb } from "@/lib/db/client";
import { normalizePhone } from "./phone";
import { createSession } from "./session";
import { OTP_VERIFICATION_ENABLED } from "./otp-mode";

export type OrderLookupResult = { ok: true } | { ok: false; error: "invalid-phone" | "not-found" | "otp-enabled" };

/**
 * "ติดตามคำสั่งซื้อ" (owner 24/10: a customer finds their orders by PHONE NUMBER ONLY — "เบอร์อย่างเดียวครับ"). The same
 * phone-only sign-in checkout already uses (owner 23/10: no OTP), with one difference: it never creates a customer. A
 * number with no order behind it gets "not found" and no session, so typing random numbers here neither fills the
 * customers table nor tells the visitor more than checkout would.
 *
 * Known and accepted by the owner: whoever knows a customer's number can open that customer's orders (checkout already
 * allows the same). If OTP is ever switched on, this path refuses — it must then go through the code step like checkout.
 */
export async function signInToTrackOrders(rawPhone: string): Promise<OrderLookupResult> {
  if (OTP_VERIFICATION_ENABLED) return { ok: false, error: "otp-enabled" };
  const phone = normalizePhone(rawPhone);
  if (!phone) return { ok: false, error: "invalid-phone" };

  const row = getDb()
    .prepare("SELECT c.id FROM customers c WHERE c.phone = ? AND EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)")
    .get(phone) as { id: number } | undefined;
  if (!row) return { ok: false, error: "not-found" };

  await createSession(row.id);
  return { ok: true };
}
