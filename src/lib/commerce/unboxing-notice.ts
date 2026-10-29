/**
 * When the customer's order page shows the unboxing-video notice (owner 29/10: claims need a continuous unboxing video,
 * BSOT §12). Pure — unboxing-notice-contract-test.ts holds every branch.
 *
 * "waiting" = a slip is in and the parcel has not arrived yet: film it when it comes.
 * "received" = the 7-day claim window after delivery: send the video if something is wrong.
 */
export type UnboxingNotice = "waiting" | "received" | null;

const DAY_MS = 86_400_000;
/** The claim window after delivery (BSOT §12). */
export const CLAIM_DAYS = 7;
/** A shipped order nobody marked completed: 1–3 days on the road + the claim window, then the notice goes. */
export const SHIPPED_FALLBACK_DAYS = 10;

const WAITING = new Set(["payment_submitted", "awaiting_verification", "approved", "processing"]);

/** The latest time the order entered `status`, or null. */
function enteredAt(history: readonly { status: string; createdAt: string }[], status: string): number | null {
  let at: number | null = null;
  for (const h of history) {
    if (h.status !== status) continue;
    const t = Date.parse(h.createdAt);
    if (!Number.isNaN(t) && (at === null || t > at)) at = t;
  }
  return at;
}

export function unboxingNoticeFor(
  status: string,
  history: readonly { status: string; createdAt: string }[],
  now: Date,
): UnboxingNotice {
  if (WAITING.has(status)) return "waiting";
  if (status === "shipped") {
    const shipped = enteredAt(history, "shipped");
    // No ship time on record (an order from before history rows existed): keep the notice — it is harmless.
    return shipped === null || now.getTime() - shipped <= SHIPPED_FALLBACK_DAYS * DAY_MS ? "waiting" : null;
  }
  if (status === "completed") {
    const done = enteredAt(history, "completed");
    return done !== null && now.getTime() - done <= CLAIM_DAYS * DAY_MS ? "received" : null;
  }
  return null; // pending_payment (nothing paid yet) · cancelled
}
