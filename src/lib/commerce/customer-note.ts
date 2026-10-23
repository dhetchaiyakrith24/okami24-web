// Pure (no I/O) so the contract test can run it under plain tsx — same convention as pricing.ts.

/** Longest note a customer may leave the shop on the review step (cart UX batch C, owner 24/10: "≤200"). */
export const CUSTOMER_NOTE_MAX = 200;

/**
 * The customer's note to the shop, made safe to store: control and invisible characters out, runs of spaces / new lines
 * folded to one (a short note, not a letter), trimmed, cut at 200 characters. Not a string or empty = null (no note).
 * React escapes it on the staff page; it never reaches money, stock or the LINE alert.
 */
export function cleanCustomerNote(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const text = raw.replace(/[\u0000-\u001f\u007f\u200b-\u200d\u2060\ufeff]+/g, " ").replace(/\s+/g, " ").trim();
  return text ? Array.from(text).slice(0, CUSTOMER_NOTE_MAX).join("") : null;
}
