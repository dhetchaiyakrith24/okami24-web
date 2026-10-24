/**
 * Order status enum — verbatim from docs/BUSINESS_SOURCE_OF_TRUTH.md §9 ("Target order status
 * should support at least: ..."). Do not add, rename, or reorder statuses without updating that
 * document first; this file exists so every other module imports one shared list instead of
 * hand-typing status strings that could drift.
 */
export const ORDER_STATUSES = [
  "pending_payment",
  "payment_submitted",
  "awaiting_verification",
  "approved",
  "processing",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

const STATUS_LABEL_EN: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  payment_submitted: "Payment submitted",
  awaiting_verification: "Awaiting admin verification",
  approved: "Approved",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_LABEL_TH: Record<OrderStatus, string> = {
  pending_payment: "รอชำระเงิน",
  payment_submitted: "แจ้งชำระเงินแล้ว",
  awaiting_verification: "รอตรวจสอบโดยแอดมิน",
  approved: "อนุมัติแล้ว",
  processing: "กำลังเตรียมจัดส่ง",
  shipped: "จัดส่งแล้ว",
  completed: "สำเร็จ",
  cancelled: "ยกเลิกแล้ว",
};

// Chinese labels written 2026-09-06 together with the zh service pages (writer agent), so the
// status a customer reads on /how-to-order matches the one on their order page.
const STATUS_LABEL_ZH: Record<OrderStatus, string> = {
  pending_payment: "待付款",
  payment_submitted: "已提交付款",
  awaiting_verification: "等待管理员核实",
  approved: "已批准",
  processing: "备货中",
  shipped: "已发货",
  completed: "已完成",
  cancelled: "已取消",
};

export function orderStatusLabel(status: OrderStatus, locale: "en" | "th" | "zh"): string {
  if (locale === "th") return STATUS_LABEL_TH[status];
  if (locale === "zh") return STATUS_LABEL_ZH[status];
  return STATUS_LABEL_EN[status];
}

/** Statuses a customer-submitted payment claim can legally move an order out of. Anything else
 *  (e.g. already `cancelled`) must reject the transition rather than silently applying it. */
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["payment_submitted", "cancelled"],
  payment_submitted: ["awaiting_verification", "cancelled"],
  awaiting_verification: ["approved", "cancelled"],
  approved: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}
