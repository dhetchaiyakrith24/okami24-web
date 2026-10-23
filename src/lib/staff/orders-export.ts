import "server-only";
import { getDb } from "@/lib/db/client";
import { orderStatusLabel, type OrderStatus } from "@/lib/commerce/order-status";
import { toCsv } from "./csv";

/**
 * Every web order as one Excel-ready CSV (owner 23/10: keep the orders and each customer's buying history on the
 * shop's own computer). One row per order line, newest order first, so filtering the customer-phone column in Excel
 * shows that customer's whole history. Reached only through the staff export route, which checks the staff session.
 */

const HEADER = [
  "เลขออเดอร์",
  "วันเวลาสั่ง",
  "สถานะ",
  "เบอร์ลูกค้า (บัญชี)",
  "ชื่อผู้รับ",
  "เบอร์ผู้รับ",
  "ที่อยู่",
  "ตำบล/แขวง",
  "อำเภอ/เขต",
  "จังหวัด",
  "รหัสไปรษณีย์",
  "สินค้า",
  "ตัวเลือก",
  "จำนวน",
  "ราคาต่อชิ้น (บาท)",
  "รวมรายการ (บาท)",
  "ค่าส่ง (บาท)",
  "ยอดออเดอร์ (บาท)",
  "เลขพัสดุ",
];

const BANGKOK = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Bangkok",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** "2026-10-23 21:15" Bangkok time — sorts as text and Excel reads it as a date. */
function bangkokTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : BANGKOK.format(d);
}

export function ordersCsv(): string {
  const rows = getDb()
    .prepare(
      `SELECT o.order_number, o.created_at, o.status, o.shipping_fee, o.total, o.tracking_number, c.phone AS customer_phone,
              a.recipient_name, a.phone AS recipient_phone, a.line1, a.subdistrict, a.district, a.province, a.postal_code,
              i.product_name_snapshot, i.variant_label, i.quantity, i.unit_price, i.line_total
         FROM orders o
         JOIN customers c ON c.id = o.customer_id
         JOIN order_shipping_addresses a ON a.order_id = o.id
         JOIN order_items i ON i.order_id = o.id
        ORDER BY o.id DESC, i.id ASC`
    )
    .all() as {
    order_number: string;
    created_at: string;
    status: OrderStatus;
    shipping_fee: number;
    total: number;
    tracking_number: string | null;
    customer_phone: string;
    recipient_name: string;
    recipient_phone: string;
    line1: string;
    subdistrict: string;
    district: string;
    province: string;
    postal_code: string;
    product_name_snapshot: string;
    variant_label: string | null;
    quantity: number;
    unit_price: number;
    line_total: number;
  }[];

  return toCsv(
    HEADER,
    rows.map((r) => [
      { keepZeros: r.order_number },
      bangkokTime(r.created_at),
      orderStatusLabel(r.status, "th"),
      { keepZeros: r.customer_phone },
      r.recipient_name,
      { keepZeros: r.recipient_phone },
      r.line1,
      r.subdistrict,
      r.district,
      r.province,
      { keepZeros: r.postal_code },
      r.product_name_snapshot,
      r.variant_label,
      r.quantity,
      r.unit_price,
      r.line_total,
      r.shipping_fee,
      r.total,
      r.tracking_number ? { keepZeros: r.tracking_number } : null,
    ])
  );
}
