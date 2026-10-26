import { CARRIERS, toCarrierId } from "@/lib/commerce/carriers";
import type { SlipVerdict } from "@/lib/commerce/slip-decision";

export { formatBaht, formatDateTime, formatShortDateTime } from "@/app/staff/_components/format";

const VERDICT: Record<SlipVerdict, { label: string; className: string }> = {
  pass: { label: "✅ สลิปผ่าน", className: "border-verified/40 bg-verified/10 text-verified" },
  check: { label: "⚠️ สลิปต้องดูเอง", className: "border-unverified/50 bg-unverified/10 text-unverified" },
  unchecked: { label: "⏳ สลิปยังไม่ได้ตรวจ", className: "border-surface-border text-foreground-muted" },
};

/** The slip verdict as a small badge — same colours as the slip-check page. */
export function VerdictBadge({ verdict }: { verdict: SlipVerdict }) {
  const v = VERDICT[verdict];
  return <span className={`rounded-full border px-2 py-0.5 ${v.className}`}>{v.label}</span>;
}

export const REASON_LABEL: Record<string, string> = {
  "receiver-mismatch": "เงินเข้าบัญชีอื่น ไม่ใช่บัญชีร้าน",
  "receiver-unclear": "ดูบัญชีผู้รับไม่ชัด",
  "amount-mismatch": "ยอดในสลิปไม่ตรงยอดออเดอร์",
  "seen-before": "สลิปนี้เคยตรวจแล้ว",
};

const ACTION_TH: Record<string, string> = {
  confirm: "ยืนยันยอดเงิน",
  "to-warehouse": "ส่งรายการให้คลัง",
  ship: "ส่งของ",
  complete: "ลูกค้าได้รับของ",
  cancel: "ยกเลิก",
};

/** The order history keeps its notes in English (written by orders.ts / payment-slip.ts / staff/orders.ts); staff read
 *  them in Thai. Unknown notes are shown as stored. Display only — nothing stored changes. */
export function historyNoteTh(note: string): string {
  if (note === "Order created") return "ลูกค้าสั่งซื้อ";
  const slip = /^Slip attached — (?:EasySlip: (pass|check)(?: \((.+)\))?|not checked \(EasySlip unavailable\))$/.exec(note);
  if (slip) {
    if (slip[1] === "pass") return "ลูกค้าแนบสลิป — ✅ ผ่าน";
    if (slip[1] === "check") return `ลูกค้าแนบสลิป — ⚠️ ต้องดูเอง (${(slip[2] ?? "").split(", ").map((r) => REASON_LABEL[r] ?? r).join(" · ")})`;
    return "ลูกค้าแนบสลิป — ⏳ ระบบตรวจไม่ได้";
  }
  const staff = /^Staff: ([a-z-]+)(.*)$/.exec(note);
  if (staff) {
    const rest = staff[2]
      .replace(" — tracking ", " — เลขพัสดุ ")
      .replace(/ — carrier ([a-z-]+)/, (m, id: string) => {
        const c = toCarrierId(id);
        return c ? ` — ${CARRIERS[c].name.th}` : m;
      });
    return `ทีมงาน: ${ACTION_TH[staff[1]] ?? staff[1]}${rest}`;
  }
  // Out of stock after payment (cart UX batch E) — written by src/lib/commerce/stock-issues.ts.
  if (note.startsWith("Stock: out after payment")) return `ทีมงาน: แจ้งลูกค้าว่าสินค้าหมด${note.replace(/^Stock: out after payment — lines [\d,]+/, "")}`;
  if (note.startsWith("Stock: swapped — ")) return `ทีมงาน: เปลี่ยนสินค้าให้แล้ว — ${note.slice("Stock: swapped — ".length)}`;
  if (note.startsWith("Stock: refunded — ref ")) return `ทีมงาน: คืนเงินแล้ว — เลขอ้างอิง ${note.slice("Stock: refunded — ref ".length)}`;
  // Queue B4 — written by saveRefundSlip in src/lib/commerce/slip-images.ts.
  if (note === "Stock: refund slip attached") return "ทีมงาน: แนบสลิปโอนคืนให้ลูกค้าดู";
  if (note === "Stock: refund slip replaced") return "ทีมงาน: เปลี่ยนรูปสลิปโอนคืน";
  if (note === "Customer: chose swap") return "ลูกค้าเลือกเปลี่ยนสินค้า";
  if (note === "Customer: chose refund") return "ลูกค้าเลือกรับเงินคืน";
  return note;
}
