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
  /** Shipnity's carrier name (EMS / DHL — owner 30/10), the last line when given. */
  carrier?: string;
  /** A LINE order keyed on /staff/line-order (migration 0026) heads its block "ออเดอร์ LINE"; every other order "ออเดอร์เว็บ". */
  channel?: "web" | "line";
}): string {
  return [
    `${input.channel === "line" ? "ออเดอร์ LINE" : "ออเดอร์เว็บ"} ${input.orderNumber}`,
    ...input.lines.map((l) => `${l.sku ?? "[ไม่มีรหัสคลัง]"} × ${l.quantity}  (${l.name})`),
    `ผู้รับ ${input.recipientName} ${input.phone}`,
    input.address,
    ...(input.carrier ? [`ขนส่ง ${input.carrier}`] : []),
  ].join("\n");
}

/**
 * THE WAREHOUSE MAY ALREADY HAVE IT (LINE_ORDERS_GAPS.md #1 and #4). Our site only ever sends Shipnity a NEW order — a cancel
 * on the web never reaches the warehouse (whether Shipnity would act on an update is unknown until the owner asks the
 * warehouse). So cancelling an order the warehouse may hold needs the admin's tick that they cancelled it in Shipnity or told
 * the warehouse admin. "May hold": sent by our button, or handed over by hand (processing), or a LINE order already paid —
 * while the owner's switch is off the admin keys LINE orders into Shipnity by hand, maybe before pressing anything here.
 */
export function warehouseMayHaveIt(o: { status: OrderStatus; channel: "web" | "line"; sentToWarehouse: boolean }): boolean {
  if (o.status === "cancelled" || o.status === "shipped" || o.status === "completed") return false;
  return o.sentToWarehouse || o.status === "processing" || (o.channel === "line" && o.status === "approved");
}

/**
 * A CANCEL THAT OWES A REFUND (owner 12/11, via Friday: "ยกเลิกออเดอร์ที่ลูกค้าจ่ายแล้ว หน้าทีมงานต้องเตือนเรื่องคืนเงิน"). Staff confirmed
 * the payment (approved — LINE orders included — or processing), so cancelling means the shop transfers the money back
 * (BSOT §9: no refund after a transfer except out of stock / cannot ship — the owner's two exceptions, which are what a cancel
 * of a paid order is). The cancel form asks for a tick that the admin knows; the out-of-stock box with every line ticked is
 * the better way (the customer picks where the refund goes, staff record it). A slip never confirmed promises no refund
 * (owner 29/10) — no tick there.
 */
export function cancelOwesRefund(status: OrderStatus): boolean {
  return status === "approved" || status === "processing";
}

/**
 * THE DOUBLE SHIPMENT (LINE_ORDERS_GAPS.md #1): once the owner's switch is ON, a paid LINE order goes to Shipnity by the
 * order page's button. Keyed into Shipnity by hand as well, out of habit, the warehouse packs it twice. So the hand-over by
 * hand ("ส่งรายการให้คลังแล้ว") of a LINE order, while the button can send it, needs the admin's tick that they keyed it into
 * Shipnity themselves and did not press the button — and the button carries a red "do not key it again" line.
 * While the owner's auto-push switch is on (src/lib/woo/auto-push-rules.ts) the system may already have sent ANY paid order,
 * so every hand-over by hand needs the tick. Only while Shipnity takes orders from us (`shipnityReady`): with no link, nothing
 * can send by itself and the hand-over by hand is the only way, so asking would only block the admin.
 */
export function handoverNeedsTick(o: { channel: "web" | "line"; lineSwitchOn: boolean; autoOn?: boolean; shipnityReady: boolean }): boolean {
  if (!o.shipnityReady) return false;
  return o.autoOn === true || (o.channel === "line" && o.lineSwitchOn);
}
