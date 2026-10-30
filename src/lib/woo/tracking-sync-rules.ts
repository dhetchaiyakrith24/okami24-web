import type { OrderStatus } from "@/lib/commerce/order-status";
import { stepsFor } from "@/lib/staff/order-actions";
import { parseTracking, type ParsedTracking } from "./tracking-parse";

/**
 * Tracking sync step 2 (owner 29/10 "ระบบดึงเลขพัสดุทำเลยครับ", warehouse 30/10 "หลัง ปณ ยิงของ ออเดอร์จะเปลี่ยนสถานะ"): when
 * Shipnity writes a tracking number to an order the site sent it, the order takes that number and moves to "shipped"
 * exactly as if staff pressed "บันทึกว่าส่งของแล้ว" (order-actions.ts `ship`). This decides whether it may — pure, so
 * tracking-sync-contract-test.ts holds every case; tracking-sync.ts reads the order and applies it.
 *
 *   - only an order the site really sent to Shipnity (woo_order_sends.first_sent_at) — never any other order;
 *   - only forward, through the same legal steps as the staff button (approved / processing → shipped); a cancelled,
 *     shipped or completed order is never moved, and money is never touched;
 *   - an order already shipped with the same number = nothing to do (Shipnity repeats its writes 2–3 times); with a
 *     different number = left alone (staff typed it — they decide);
 *   - carrier: the number's own format or the provider text when it names one (S10 "..TH" = Thailand Post, the only
 *     carrier with that format); otherwise only DHL can be meant when the order went to Shipnity as DHL (Shipnity's
 *     DHL number has no carrier word, seen 30/10). A bare number on an order sent as EMS is NOT an EMS number — left
 *     for staff instead of guessing.
 * Shipnity's own "completed" means the parcel left the warehouse, not that the customer has it, so it never sets the
 * site's "completed" (staff press "ลูกค้าได้รับของแล้ว" as before).
 */

export interface SyncOrder {
  status: OrderStatus;
  /** The order was sent to Shipnity (woo_order_sends.first_sent_at is set). */
  sentToShipnity: boolean;
  /** The tracking number the order already has, if any. */
  tracking: string | null;
  /** The carrier the order went to Shipnity with: staff's pick, else from the postcode (order-push.ts). */
  sentCarrier: "thailand-post" | "dhl";
}

export type SkipReason = "no-number" | "not-sent" | "same-number" | "other-number" | "status" | "carrier-unclear";

export type ShipDecision = { ship: true; tracking: string; carrier: "thailand-post" | "dhl" } | { ship: false; reason: SkipReason };

export function decideShip(order: SyncOrder, found: ParsedTracking | null): ShipDecision {
  if (!found) return { ship: false, reason: "no-number" };
  if (!order.sentToShipnity) return { ship: false, reason: "not-sent" };
  if (order.tracking) return { ship: false, reason: order.tracking === found.number ? "same-number" : "other-number" };
  if (!stepsFor("ship", order.status)) return { ship: false, reason: "status" };
  const carrier =
    found.carrier === "thailand-post" || found.carrier === "dhl"
      ? found.carrier
      : found.carrier === null && order.sentCarrier === "dhl"
        ? "dhl"
        : null;
  if (!carrier) return { ship: false, reason: "carrier-unclear" };
  return { ship: true, tracking: found.number, carrier };
}

/** The tracking numbers in one logged write (woo_api_log row: method, path, raw body), for the catch-up of numbers that
 *  came before this sync existed. Same reading as the live route: a note, a tracking route, an order PUT, a batch. */
export function trackingsInLoggedWrite(method: string, path: string, rawBody: string | null): { orderId: number; tracking: ParsedTracking }[] {
  if (method === "GET" || method === "DELETE" || !rawBody) return [];
  const m = /^\/wp-json\/[a-z-]+\/v\d+\/orders\/(\d+|batch)(?:\/(notes|shipment-trackings))?$/.exec(path);
  if (!m) return [];
  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return [];
  }
  const one = (orderId: number, kind: "order" | "note" | "tracking-route", b: unknown) => {
    const tracking = parseTracking(kind, b);
    return tracking ? [{ orderId, tracking }] : [];
  };
  if (m[1] === "batch") {
    if (m[2]) return [];
    const update = (body as { update?: unknown })?.update;
    return Array.isArray(update) ? update.flatMap((u) => one(Number((u as { id?: unknown })?.id), "order", u)) : [];
  }
  return one(Number(m[1]), m[2] === "notes" ? "note" : m[2] === "shipment-trackings" ? "tracking-route" : "order", body);
}

/** Staff-facing words for a skip (the dry-run list on /staff/api/shipnity-tracking-sync). */
export const SKIP_TH: Record<SkipReason, string> = {
  "no-number": "ไม่มีเลขพัสดุ",
  "not-sent": "ไม่ใช่ออเดอร์ที่ส่งเข้า Shipnity",
  "same-number": "ใส่เลขนี้แล้ว",
  "other-number": "มีเลขพัสดุอื่นอยู่แล้ว (ทีมงานใส่เอง) — ไม่แตะ",
  status: "สถานะไม่ใช่รอส่งของ (ยกเลิก / ส่งแล้ว / ยังไม่จ่าย) — ไม่แตะ",
  "carrier-unclear": "บอกขนส่งไม่ได้ (เลขไม่ใช่แบบไปรษณีย์ แต่ออเดอร์ส่งไปแบบ EMS) — ทีมงานใส่เอง",
};
