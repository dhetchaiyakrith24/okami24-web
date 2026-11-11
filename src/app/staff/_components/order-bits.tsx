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

const HOW_TH: Record<string, string> = {
  "slip from the slip check": "ผูกสลิปที่บอทตรวจแล้ว",
  "difference confirmed by hand": "ยืนยันเงินส่วนต่างเอง (ดูในแอปธนาคาร)",
  "money to confirm by hand": "รอยืนยันยอดเงินเอง",
};

/** The order history keeps its notes in English (written by orders.ts / payment-slip.ts / staff/orders.ts); staff read
 *  them in Thai. Unknown notes are shown as stored. Display only — nothing stored changes. */
export function historyNoteTh(note: string): string {
  if (note === "Order created") return "ลูกค้าสั่งซื้อ";
  // A keyed LINE order changed before it went to the warehouse (src/lib/staff/line-order-edit.ts).
  const items = /^Staff \((.+?)\): items changed (\d+) → (\d+) THB — (.+)$/.exec(note);
  if (items) return `ทีมงาน (${items[1]}): แก้รายการสินค้า ยอด ${items[2]} → ${items[3]} บาท — ${HOW_TH[items[4]] ?? items[4]}`;
  // A LINE order keyed on /staff/line-order (src/lib/staff/line-orders.ts).
  const keyed = /^Staff: LINE order keyed by (.+?)( — ticked: not a duplicate)?$/.exec(note);
  if (keyed) return `ทีมงาน: คีย์ออเดอร์ LINE โดย ${keyed[1]}${keyed[2] ? " — ติ๊กว่าไม่ใช่ออเดอร์ซ้ำ" : ""}`;
  if (note === "Staff: slip picked from the slip check") return "ทีมงาน: เลือกสลิปที่บอทตรวจแล้ว";
  if (note === "Staff: no slip in the slip check — confirm the money by hand") return "ทีมงาน: ไม่มีสลิปในรายการ — ยืนยันยอดเงินเองในหน้านี้";
  // A special price given when the LINE order was keyed (migration 0028, src/lib/staff/line-orders.ts).
  const special = /^Staff \((.+?)\): special price (\d+) → (\d+) THB(?: — (.*))?$/.exec(note);
  if (special) return `ทีมงาน (${special[1]}): ราคาพิเศษ จากราคาเว็บ ${special[2]} → ${special[3]} บาท${special[4] ? ` — ${special[4]}` : ""}`;
  // The shipping address fixed before the warehouse had it (src/lib/staff/order-address.ts).
  const address = /^Staff \((.+?)\): address changed — was: (.*)$/.exec(note);
  if (address) return `ทีมงาน (${address[1]}): แก้ที่อยู่จัดส่ง — ที่อยู่เดิม ${address[2]}`;
  const slip = /^Slip attached — (?:EasySlip: (pass|check)(?: \((.+)\))?|not checked \(EasySlip unavailable\))$/.exec(note);
  if (slip) {
    if (slip[1] === "pass") return "ลูกค้าแนบสลิป — ✅ ผ่าน";
    if (slip[1] === "check") return `ลูกค้าแนบสลิป — ⚠️ ต้องดูเอง (${(slip[2] ?? "").split(", ").map((r) => REASON_LABEL[r] ?? r).join(" · ")})`;
    return "ลูกค้าแนบสลิป — ⏳ ระบบตรวจไม่ได้";
  }
  // "Shipnity: ship — …" = the warehouse's Shipnity wrote the tracking number back (src/lib/woo/tracking-sync.ts).
  const staff = /^(Staff|Shipnity): ([a-z-]+)(.*)$/.exec(note);
  if (staff) {
    const rest = staff[3]
      .replace(" — warehouse: cancelled in Shipnity / told (ticked)", " — ยกเลิกใน Shipnity / แจ้งแอดมินคลังแล้ว (ติ๊ก)")
      .replace(" — keyed into Shipnity by hand (ticked)", " — คีย์ใน Shipnity เองแล้ว (ติ๊ก)")
      // The warehouse cancelled in Shipnity → the web cancelled itself (src/lib/woo/warehouse-cancel.ts, owner 11/11).
      .replace(" — warehouse cancelled", " — คลังยกเลิกใน Shipnity เว็บยกเลิกให้อัตโนมัติ")
      .replace(" — warehouse refunded", " — คลังคืนเงิน / ยกเลิกใน Shipnity เว็บยกเลิกให้อัตโนมัติ")
      .replace(" — tracking ", " — เลขพัสดุ ")
      .replace(/ — carrier ([a-z-]+)/, (m, id: string) => {
        const c = toCarrierId(id);
        return c ? ` — ${CARRIERS[c].name.th}` : m;
      });
    return `${staff[1] === "Shipnity" ? "คลัง (Shipnity)" : "ทีมงาน"}: ${ACTION_TH[staff[2]] ?? staff[2]}${rest}`;
  }
  // Out of stock after payment (cart UX batch E) — written by src/lib/commerce/stock-issues.ts.
  // The same box opened by the warehouse cancel (src/lib/woo/warehouse-cancel.ts): the whole order, refund only.
  if (/^Stock: out after payment — lines [\d,]+ — คลังยกเลิกใน Shipnity/.test(note)) return "คลัง (Shipnity): เปิดให้ลูกค้าเลือกช่องทางรับเงินคืนทั้งออเดอร์";
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
