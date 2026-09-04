import "server-only";
import { getDb } from "@/lib/db/client";

/**
 * The Shipnity integration boundary. docs/BUSINESS_SOURCE_OF_TRUTH.md §19 lists "Shipnity
 * integration mechanism/API availability" as an explicit unknown — there is no API base URL,
 * auth scheme, or credential anywhere in this repo, and inventing one would violate the mission's
 * explicit prohibition on assuming Shipnity API behavior. This interface is the seam a real
 * adapter plugs into later; `ManualQueueShipnityAdapter` below is the only implementation, and it
 * does no network I/O at all — it durably records what *should* be pushed, for a human admin to
 * action, which is honest about what's actually possible today.
 *
 * Inbound stock/price signal is NOT fetched here either: it already flows through the existing
 * Shipnity-seed → ProductMaster pipeline (src/data/shipnity-seed/), which this module doesn't
 * duplicate. `checkAvailability` below reads that same published-catalog signal rather than
 * pretending to poll a live API.
 */
export interface ShipnityPushPayload {
  orderId: number;
  orderNumber: string;
  items: { productSlug: string; variantId: string | null; quantity: number }[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    line1: string;
    subdistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
}

export type ShipnityPushOutcome = { status: "pending_manual" | "synced"; externalReference: string | null } | { status: "failed"; error: string };

export interface ShipnityAdapter {
  pushOrder(payload: ShipnityPushPayload): Promise<ShipnityPushOutcome>;
}

/**
 * DEV/FOUNDATION STUB: queues the order for manual entry instead of calling a real API. Writes to
 * `shipnity_sync_log` so it is retryable and idempotent (see syncOrderToShipnity below) — the
 * moment a real Shipnity API is available, only this class needs to change; every caller keeps
 * working against the same interface.
 */
class ManualQueueShipnityAdapter implements ShipnityAdapter {
  async pushOrder(payload: ShipnityPushPayload): Promise<ShipnityPushOutcome> {
    console.log(
      `[shipnity:stub] order ${payload.orderNumber} needs manual entry into Shipnity (no real API configured yet) — ${payload.items.length} line(s).`
    );
    return { status: "pending_manual", externalReference: null };
  }
}

export const shipnityAdapter: ShipnityAdapter = new ManualQueueShipnityAdapter();

interface SyncLogRow {
  id: number;
  status: string;
  attempt_count: number;
}

/**
 * Idempotent push-with-retry: safe to call more than once for the same order (e.g. a retry after
 * a transient failure, or an admin manually re-triggering sync) — it reuses the existing log row
 * rather than creating a second one, and does nothing once a row already reads "synced".
 */
export async function syncOrderToShipnity(orderId: number, payload: ShipnityPushPayload): Promise<ShipnityPushOutcome> {
  const db = getDb();
  const existing = db.prepare("SELECT id, status, attempt_count FROM shipnity_sync_log WHERE order_id = ?").get(orderId) as
    | SyncLogRow
    | undefined;

  if (existing?.status === "synced") {
    return { status: "synced", externalReference: null };
  }

  if (!existing) {
    db.prepare("INSERT INTO shipnity_sync_log (order_id, status, attempt_count) VALUES (?, 'pending_manual', 0)").run(orderId);
  }

  try {
    const outcome = await shipnityAdapter.pushOrder(payload);
    db.prepare(
      `UPDATE shipnity_sync_log
       SET status = ?, attempt_count = attempt_count + 1, last_attempted_at = datetime('now'),
           external_reference = ?, last_error = NULL, updated_at = datetime('now')
       WHERE order_id = ?`
    ).run(outcome.status === "failed" ? "failed" : outcome.status, outcome.status === "failed" ? null : outcome.externalReference, orderId);
    if (outcome.status === "failed") {
      db.prepare("UPDATE shipnity_sync_log SET last_error = ? WHERE order_id = ?").run(outcome.error, orderId);
    }
    return outcome;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    db.prepare(
      `UPDATE shipnity_sync_log
       SET status = 'failed', attempt_count = attempt_count + 1, last_attempted_at = datetime('now'),
           last_error = ?, updated_at = datetime('now')
       WHERE order_id = ?`
    ).run(message, orderId);
    return { status: "failed", error: message };
  }
}
