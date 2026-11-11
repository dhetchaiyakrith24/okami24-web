/**
 * "ใครทำอะไร" (owner 10/11): the words for each recorded action (src/lib/staff/audit.ts), the day and person filters, and the short
 * detail line of an order step. Pure, so the contract test runs it under plain tsx. Keys are stored in `staff_audit.action`,
 * so a key is never renamed — add a new one instead. A detail line never holds a customer's name, phone, address or bank account.
 */
export const AUDIT_ACTIONS = {
  "sign-in": "เข้าระบบ",
  "sign-out": "ออกจากระบบ",
  // T2-14: every wrong try of the shared team password, and the lock that follows — no address, no IP, only that it happened.
  "sign-in-failed": "ใส่รหัสผิด",
  "sign-in-locked": "ถูกล็อก (ใส่ผิดหลายครั้ง)",
  "team-add": "เพิ่มแอดมิน",
  "team-rename": "เปลี่ยนชื่อแอดมิน",
  "team-disable": "ปิดบัญชีแอดมิน",
  "team-enable": "เปิดบัญชีแอดมินอีกครั้ง",
  "shared-password-off": "ปิดรหัสร่วม",
  "shared-password-on": "เปิดรหัสร่วม",
  "order-confirm": "ยืนยันเงิน",
  "order-to-warehouse": "บันทึกว่าส่งรายการให้คลังแล้ว",
  "order-shipnity": "ส่งเข้าคลัง Shipnity",
  "order-ship": "ใส่เลขพัสดุ",
  "order-complete": "ปิดออเดอร์ ลูกค้าได้รับของ",
  "order-cancel": "ยกเลิกออเดอร์",
  "order-carrier": "เปลี่ยนขนส่ง",
  "order-message": "ส่งข้อความถึงลูกค้า",
  "stock-open": "แจ้งลูกค้าว่าของหมด",
  "stock-swap": "เปลี่ยนสินค้าตามที่ลูกค้าเลือก",
  "stock-refunded": "บันทึกคืนเงิน",
  "refund-slip": "แนบสลิปคืนเงิน",
  "line-order": "คีย์ออเดอร์ LINE",
  "slip-check": "ตรวจสลิป",
  "line-group": "ตั้งกลุ่ม LINE ของบอท",
  export: "ดาวน์โหลดไฟล์ออเดอร์ทั้งหมด",
  "tracking-sync": "ดึงเลขพัสดุจาก Shipnity",
  "shipnity-key-new": "สร้างกุญแจเชื่อม Shipnity",
  "shipnity-key-revoke": "ปิดกุญแจเชื่อม Shipnity",
  "shipnity-webhook": "อนุญาตหรือหยุดส่งออเดอร์ให้ Shipnity",
  "order-discount": "ให้ส่วนลด",
  "line-refund-match": "จับคู่เงินคืน LINE กับสลิป",
  "line-refund-add": "เพิ่มเงินคืน LINE เอง",
  "line-refund-undo": "ยกเลิกเงินคืน LINE",
  "order-items": "แก้รายการสินค้า",
  "order-address": "แก้ที่อยู่จัดส่ง",
  "shop-switch": "เปลี่ยนสวิตช์ร้าน",
  "product-hide": "ซ่อนสินค้า",
  "product-show": "เปิดสินค้ากลับ",
  "costs-save": "แก้ตารางทุน",
  "bill-check": "เทียบบิลคลัง",
} as const;

export type AuditAction = keyof typeof AUDIT_ACTIONS;

export const auditLabel = (action: string): string => (AUDIT_ACTIONS as Record<string, string>)[action] ?? action;

/** The order-page buttons (src/lib/staff/order-actions.ts) → their record. */
export const ORDER_STEP_AUDIT = {
  confirm: "order-confirm",
  "to-warehouse": "order-to-warehouse",
  ship: "order-ship",
  complete: "order-complete",
  cancel: "order-cancel",
} as const satisfies Record<string, AuditAction>;

/** The detail of an order step: the tracking number and carrier, or that a cancel told the customer why — never the text
 *  itself (it may hold the customer's details; the order's own history keeps it). */
export function orderStepDetail(step: string, input: { tracking?: string; carrier?: string; message?: string }): string | null {
  if (step === "ship") return [input.carrier?.trim(), input.tracking?.replace(/\s+/g, "").toUpperCase()].filter(Boolean).join(" · ") || null;
  if (step === "cancel") return input.message?.trim() ? "แจ้งเหตุผลลูกค้าแล้ว" : null;
  return null;
}

/** A bank or slip reference in a record: its last 6 characters only (enough to find the slip, not the whole reference). */
export const refTail = (ref: string): string | null => {
  const r = ref.replace(/\s+/g, "");
  return r ? `สลิปลงท้าย ${r.slice(-6)}` : null;
};

/** A step done with the shared password on a form that asks a name: the record keeps the typed name too (the person is
 *  otherwise only "รหัสร่วม"). An own account or the owner is already named — nothing added. */
export function withTypedName(actorKind: string, typed: string, detail: string | null): string | null {
  const name = typed.replace(/\s+/g, " ").trim().slice(0, 40);
  if (actorKind !== "shared" || !name) return detail;
  return [`ชื่อที่พิมพ์ ${name}`, detail].filter(Boolean).join(" · ");
}

/** The owner's switch (src/app/staff/owner/actions.ts) in the owner's words; null = not a switch. */
export function switchDetail(kind: unknown, on: boolean): string | null {
  if (kind === "cart") return on ? "เปิดตะกร้า" : "ปิดตะกร้า";
  if (kind === "site") return on ? "เปิดเว็บ" : "ปิดเว็บชั่วคราว";
  if (kind === "line") return on ? "เปิดการส่งออเดอร์ LINE เข้าคลัง" : "ปิดการส่งออเดอร์ LINE เข้าคลัง";
  if (kind === "auto") return on ? "เปิดการส่งเข้าคลังอัตโนมัติ" : "ปิดการส่งเข้าคลังอัตโนมัติ";
  return null;
}

const RECEIVER: Record<string, string> = { match: "เข้าบัญชีร้าน", mismatch: "ไม่ใช่บัญชีร้าน", unclear: "ไม่แน่ใจว่าเข้าบัญชีร้าน" };

/** A slip check's record: amount + the verdict staff saw. No names, no account numbers (BSOT §9). */
export function slipCheckDetail(slip: { amount: number; receiverStatus: string }, duplicate: boolean, amountMatches: boolean | null): string {
  const amount = `฿${slip.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  const parts = [amount, RECEIVER[slip.receiverStatus] ?? slip.receiverStatus];
  if (duplicate) parts.push("สลิปเคยตรวจแล้ว");
  if (amountMatches === false) parts.push("ยอดไม่ตรงออเดอร์");
  return parts.join(" · ");
}

/** "ใครทำอะไร" filter: everyone, the owner, the shared password, or one account. */
export type AuditWho = { kind: "all" } | { kind: "owner" } | { kind: "shared" } | { kind: "account"; id: number };

export function parseWho(raw: string | undefined): AuditWho {
  if (raw === "owner" || raw === "shared") return { kind: raw };
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? { kind: "account", id } : { kind: "all" };
}

export const whoParam = (who: AuditWho): string | null => (who.kind === "all" ? null : who.kind === "account" ? String(who.id) : who.kind);

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const bangkokDate = (ms: number) => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Bangkok" }).format(new Date(ms));

/** The day to show (Bangkok calendar day), never in the future; anything unreadable = today. */
export function parseDay(raw: string | undefined, nowMs: number): string {
  const today = bangkokDate(nowMs);
  if (!raw || !DAY.test(raw) || Number.isNaN(Date.parse(`${raw}T00:00:00+07:00`))) return today;
  return raw > today ? today : raw;
}

/** A Bangkok day as the UTC ISO range `at` is stored in: [from, to). */
export function dayRange(day: string): { from: string; to: string } {
  const start = Date.parse(`${day}T00:00:00+07:00`);
  return { from: new Date(start).toISOString(), to: new Date(start + 86_400_000).toISOString() };
}

export function shiftDay(day: string, by: number): string {
  return bangkokDate(Date.parse(`${day}T12:00:00+07:00`) + by * 86_400_000);
}
