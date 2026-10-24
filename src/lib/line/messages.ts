/**
 * The text the alert bot sends (cart round 22/10) — pure, no I/O, so line-messages-contract-test.ts can hold it to
 * what staff need and to what must never be in a group chat: the customer's phone, address or account numbers.
 * Staff read the full order on /staff; the group gets the order number, items, total, slip verdict, recipient's
 * name + province and the link.
 */
import type { OrderDetail } from "@/lib/commerce/orders";
import type { SlipReason, SlipVerdict } from "@/lib/commerce/slip-decision";
import type { SlipCheckResponse } from "@/lib/staff/slip-check-types";

const baht = (n: number) => `฿${n.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

/** "22/10 14:03" in Bangkok time. */
export function bangkokTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}/${get("month")} ${get("hour")}:${get("minute")}`;
}

const REASON_TH: Record<SlipReason, string> = {
  "receiver-mismatch": "เงินเข้าบัญชีอื่น ไม่ใช่บัญชีร้าน",
  "receiver-unclear": "ดูบัญชีผู้รับไม่ชัด",
  "amount-mismatch": "ยอดในสลิปไม่ตรงยอดออเดอร์",
  "seen-before": "สลิปนี้เคยตรวจแล้ว",
};

function verdictLine(verdict: SlipVerdict, reasons: SlipReason[]): string {
  if (verdict === "pass") return "สลิป: ✅ ผ่าน (บัญชีร้าน · ยอดตรง · ไม่เคยใช้)";
  if (verdict === "unchecked") return "สลิป: ⏳ ระบบตรวจไม่ได้ตอนนี้ — เช็คยอดในแอปธนาคารเอง";
  return `สลิป: ⚠️ ต้องดูเอง — ${reasons.map((r) => REASON_TH[r]).join(" · ")}`;
}

export function formatOrderAlert(order: OrderDetail, verdict: SlipVerdict, reasons: SlipReason[], siteUrl: string): string {
  const items = order.items.map((i) => `• ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ""} ×${i.quantity}`);
  return [
    `🛒 ออเดอร์ใหม่ ${order.orderNumber}`,
    ...items,
    `ยอด ${baht(order.total)}${order.shippingFee > 0 ? ` (รวมค่าส่ง ${baht(order.shippingFee)})` : " (ไม่มีค่าส่ง)"}`,
    verdictLine(verdict, reasons),
    `ผู้รับ: ${order.shippingAddress.recipientName} · ${order.shippingAddress.province}`,
    `เปิดดู: ${siteUrl}/staff/orders/${encodeURIComponent(order.orderNumber)}`,
  ].join("\n");
}

/** Out of stock after payment (cart UX batch E): the customer chose on the order page. Never the PromptPay number — the
 *  staff page has it. */
export function formatStockChoiceAlert(orderNumber: string, choice: "swap" | "refund", siteUrl: string): string {
  return [
    `📦 ลูกค้าเลือกแล้ว — สินค้าหมด ${orderNumber}`,
    choice === "swap" ? "เลือก: เปลี่ยนเป็นสินค้าราคาเท่ากัน (เช็คของที่คลังก่อนกดยืนยัน)" : "เลือก: รับเงินคืนเข้าพร้อมเพย์ (โอนคืนแล้วบันทึกเลขอ้างอิง)",
    `เปิดดู: ${siteUrl}/staff/orders/${encodeURIComponent(orderNumber)}`,
  ].join("\n");
}

/** The bot's answer to a slip dropped into the "OKM Slip" group — the same verdicts as the staff page. */
export function formatSlipReply(result: SlipCheckResponse, attachedOrder: string | null): string {
  if (!result.ok) {
    if (result.error === "SLIP_NOT_FOUND") return "❌ อ่านสลิปจากรูปนี้ไม่ได้ (ไม่ใช่สลิป หรือ QR ไม่ชัด) ลองรูปแคปจากแอปธนาคาร";
    if (result.error === "SLIP_PENDING") return "⏳ สลิปกรุงเทพที่เพิ่งโอนไม่ถึง 5 นาที ธนาคารยังไม่ยืนยัน รอสักครู่แล้วส่งใหม่";
    if (result.error === "QUOTA_EXCEEDED") return "⚠️ โควตาตรวจสลิปเดือนนี้หมดแล้ว แจ้งเจ้าของร้าน · เช็คยอดในแอปธนาคารเอง";
    if (result.error === "RATE_LIMIT_EXCEEDED") return "⏳ ส่งตรวจถี่เกินไป รอสักครู่แล้วส่งรูปใหม่";
    return `⚠️ ตรวจสลิปไม่ได้ตอนนี้ (รหัส ${result.error}) — เช็คยอดในแอปธนาคารเอง`;
  }
  const s = result.slip;
  const lines: string[] = [];
  if (s.receiverStatus === "match") lines.push(`✅ เงินเข้าบัญชีร้าน ${baht(s.amount)}`);
  else if (s.receiverStatus === "mismatch") lines.push(`❌ เงินเข้าบัญชีอื่น ไม่ใช่บัญชีร้าน (${baht(s.amount)}) — อย่าเพิ่งยืนยัน`);
  else lines.push(`⚠️ ดูบัญชีผู้รับไม่ชัด (${baht(s.amount)}) — เปิดแอปธนาคารเช็คยอดเข้า`);
  lines.push(`โอนเมื่อ ${bangkokTime(s.transferredAt)}`);
  if (result.duplicate?.by === "log")
    lines.push(`❗ สลิปนี้เคยตรวจแล้ว (ครั้งแรก ${bangkokTime(result.duplicate.firstCheckedAt)}) — อย่าใช้กับออเดอร์ใหม่`);
  if (result.duplicate?.by === "easyslip") lines.push("❗ EasySlip แจ้งว่าเคยตรวจสลิปนี้แล้ว — ถ้าไม่แน่ใจ แจ้งเจ้าของร้าน");
  if (attachedOrder) lines.push(`ผูกกับออเดอร์เว็บ ${attachedOrder} แล้ว`);
  return lines.join("\n");
}
