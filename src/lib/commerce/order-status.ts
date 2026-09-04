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
  cancelled: "ยกเลิก",
};

export function orderStatusLabel(status: OrderStatus, locale: "en" | "th" | "zh"): string {
  // No Chinese translation exists for order-status copy yet (this is new commerce content, not
  // part of the i18n dictionary this session already fixed) — English is the honest fallback
  // rather than a guessed Chinese string. Fix forward when zh commerce copy is actually written.
  if (locale === "th") return STATUS_LABEL_TH[status];
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
