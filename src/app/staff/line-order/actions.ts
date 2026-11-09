"use server";

import { redirect } from "next/navigation";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { parseLineOrderForm } from "@/lib/staff/line-order-rules";
import { createLineOrder } from "@/lib/staff/line-orders";
import { parsePastedOrder, type PasteResult } from "@/lib/staff/line-order-paste-rules";
import { stockBook } from "@/lib/staff/stock-book";
import { placesForPostcode } from "@/lib/commerce/thai-postcodes";

export interface LineOrderState {
  error: string | null;
}

/** Why a LINE order was not saved, in the team's words. Nothing is saved on any of these. */
const ERROR_TH: Record<string, string> = {
  phone: "เบอร์โทรไม่ถูกต้อง — เบอร์มือถือ 10 หลัก ขึ้นต้น 06 08 หรือ 09 (เบอร์ผู้รับใช้เบอร์บ้านได้)",
  "keyed-by": "ใส่ชื่อคนคีย์ออเดอร์",
  items: "เลือกสินค้าอย่างน้อย 1 รายการ (ไม่เกิน 50 ชิ้นต่อรายการ)",
  missing: "กรอกชื่อผู้รับ ที่อยู่ จังหวัด และรหัสไปรษณีย์ให้ครบ",
  address: "กรอกชื่อผู้รับ ที่อยู่ ตำบล อำเภอ จังหวัด ให้ครบ",
  house: "ที่อยู่ต้องมีบ้านเลขที่",
  postal: "รหัสไปรษณีย์ไม่ตรงกับจังหวัด",
  item: "มีสินค้าที่ขายไม่ได้แล้ว — เอาออกแล้วเลือกใหม่",
  stock: "มีสินค้าที่หมดสต็อก — เอาออกหรือเลือกตัวเลือกอื่น",
  "slip-taken": "สลิปนี้ถูกใช้กับออเดอร์อื่นไปแล้ว — เลือกใบอื่น หรือเลือก ไม่มีสลิปในรายการ",
  "slip-amount": "ยอดสลิปไม่เท่ายอดออเดอร์ (รวมค่าส่งแล้ว) — ตรวจรายการสินค้าหรือเลือกสลิปใบอื่น",
};

/** /staff/line-order — save a LINE-chat order (src/lib/staff/line-orders.ts), then open it. */
export async function createLineOrderAction(_prev: LineOrderState, form: FormData): Promise<LineOrderState> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const parsed = parseLineOrderForm((name) => form.get(name));
  if (!parsed.ok) return { error: ERROR_TH[parsed.error] };
  const result = createLineOrder(parsed.input);
  if (!result.ok) return { error: ERROR_TH[result.error] };
  console.log(`[line-order] ${result.orderNumber} keyed${result.confirmed ? ", money confirmed by its slip" : ", waiting for the money"}`);
  redirect(`/staff/orders/${encodeURIComponent(result.orderNumber)}?done=line-order`);
}

/** "เติมฟอร์มจากข้อความ" — read the admin's pasted LINE text into form values (line-order-paste-rules.ts). Saves nothing. */
export async function parsePasteAction(text: string): Promise<PasteResult | null> {
  if (!staffAreaEnabled() || !(await isStaff())) return null;
  const products = stockBook()
    .map((p) => ({ slug: p.slug, name: p.name, options: p.options.filter((o) => o.sells).map((o) => ({ id: o.id, name: o.name })) }))
    .filter((p) => p.options.length > 0);
  return parsePastedOrder(String(text).slice(0, 4000), products, placesForPostcode);
}
