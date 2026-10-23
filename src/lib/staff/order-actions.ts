/**
 * What a staff member can do to an order on /staff/orders (cart round 22/10) — pure, no I/O, so
 * order-actions-contract-test.ts can hold every button to the BSOT §9 status list and its legal transitions
 * (src/lib/commerce/order-status.ts). One button may walk more than one step (e.g. "payment checked" =
 * payment_submitted → awaiting_verification → approved); every step is still a legal transition and is written to the
 * order's history, so the customer's status page shows the same path it always did.
 */
import { canTransition, type OrderStatus } from "../commerce/order-status";

export type StaffAction = "confirm" | "to-warehouse" | "ship" | "complete" | "cancel";

export const STAFF_ACTIONS: Record<StaffAction, { label: string; path: OrderStatus[] }> = {
  confirm: { label: "ยืนยันยอดเงินแล้ว", path: ["awaiting_verification", "approved"] },
  "to-warehouse": { label: "ส่งรายการให้คลังแล้ว", path: ["processing"] },
  ship: { label: "ส่งของแล้ว (เลือกขนส่ง + ใส่เลขพัสดุ)", path: ["processing", "shipped"] },
  complete: { label: "ลูกค้าได้รับของแล้ว", path: ["completed"] },
  cancel: { label: "ยกเลิกออเดอร์", path: ["cancelled"] },
};

/** The statuses this action would write, starting from `from` — steps the order has already passed are skipped.
 *  null = the action is not possible from here. */
export function stepsFor(action: StaffAction, from: OrderStatus): OrderStatus[] | null {
  const path = STAFF_ACTIONS[action].path;
  // Skip any leading steps the order is already at (e.g. "ship" from "processing" only writes "shipped").
  const start = path.indexOf(from);
  const steps = start >= 0 ? path.slice(start + 1) : path;
  if (steps.length === 0) return null;
  let cur = from;
  for (const next of steps) {
    if (!canTransition(cur, next)) return null;
    cur = next;
  }
  return steps;
}

export function availableActions(from: OrderStatus): StaffAction[] {
  return (Object.keys(STAFF_ACTIONS) as StaffAction[]).filter((a) => stepsFor(a, from) !== null);
}

/** A tracking number as staff paste it: letters, digits and dashes, 6–40 long. */
export function cleanTracking(raw: string): string | null {
  const t = raw.trim().toUpperCase().replace(/\s+/g, "");
  return /^[A-Z0-9-]{6,40}$/.test(t) ? t : null;
}

export interface WarehouseLine {
  sku: string | null;
  name: string;
  quantity: number;
}

/** The block staff paste to the warehouse (the same shape as a LINE order today): one line per item with the
 *  warehouse code, then who it goes to. A missing code is written out loud so nobody sends a blank line. */
export function warehouseText(input: {
  orderNumber: string;
  lines: WarehouseLine[];
  recipientName: string;
  phone: string;
  address: string;
}): string {
  return [
    `ออเดอร์เว็บ ${input.orderNumber}`,
    ...input.lines.map((l) => `${l.sku ?? "[ไม่มีรหัสคลัง]"} × ${l.quantity}  (${l.name})`),
    `ผู้รับ ${input.recipientName} ${input.phone}`,
    input.address,
  ].join("\n");
}
