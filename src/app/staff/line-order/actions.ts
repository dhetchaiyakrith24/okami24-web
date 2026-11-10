"use server";

import { redirect } from "next/navigation";
import { currentStaff, isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { nameOf, type StaffActor } from "@/lib/staff/account-rules";
import { markKeyedBy, recordStaffAction } from "@/lib/staff/audit";
import { parseItems, parseLineOrderForm } from "@/lib/staff/line-order-rules";
import { createLineOrder } from "@/lib/staff/line-orders";
import { changeLineOrderItems } from "@/lib/staff/line-order-edit";
import { parsePastedOrder, type PasteResult } from "@/lib/staff/line-order-paste-rules";
import { stockBook } from "@/lib/staff/stock-book";
import { placesForPostcode } from "@/lib/commerce/thai-postcodes";
import { isStaffJob } from "@/lib/staff/jobs";
import { autoPushDone } from "@/lib/woo/auto-push";
import { autoPushed } from "@/lib/staff/auto-push-audit";

export interface LineOrderState {
  error: string | null;
  /** The recent order this one looks like (same phone, same total, 24 h) — the form then asks "ไม่ใช่ออเดอร์ซ้ำ". */
  duplicateOf?: string;
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
  "slip-amount": "ยอดสลิปไม่เท่ายอดออเดอร์ (รวมค่าส่งแล้ว) — ตรวจรายการสินค้า ราคาพิเศษ หรือเลือกสลิปใบอื่น",
  price: "ราคาพิเศษต้องเป็นตัวเลขบาท และไม่เกินราคาเว็บรวมค่าส่ง",
};

async function actorOrBack(): Promise<StaffActor> {
  const actor = staffAreaEnabled() ? await currentStaff() : null;
  if (!actor) redirect("/staff");
  return actor;
}

/** /staff/line-order — save a LINE-chat order (src/lib/staff/line-orders.ts), then open it. Signed in with an own account
 *  (owner 10/11) = keyed and any special price under that account; the shared password = the typed name, as before. */
export async function createLineOrderAction(_prev: LineOrderState, form: FormData): Promise<LineOrderState> {
  const actor = await actorOrBack();
  const parsed = parseLineOrderForm((name) => (name === "keyedBy" ? nameOf(actor, String(form.get(name) ?? "")) : form.get(name)));
  if (!parsed.ok) return { error: ERROR_TH[parsed.error] };
  const result = createLineOrder({ ...parsed.input, keyedByStaffId: actor.accountId });
  // One message, in the yellow box (checker 10/11 on #1362: a red line saying the same thing above it read twice).
  if (!result.ok && result.error === "duplicate") return { error: null, duplicateOf: result.duplicateOf };
  if (!result.ok) return { error: ERROR_TH[result.error] };
  markKeyedBy(result.orderNumber, actor);
  recordStaffAction(actor, "line-order", { orderNumber: result.orderNumber, detail: result.confirmed ? "ยืนยันยอดด้วยสลิปแล้ว" : null });
  if (result.discount) {
    const why = parsed.input.priceReason?.trim();
    recordStaffAction(actor, "order-discount", { orderNumber: result.orderNumber, detail: `ลด ฿${result.discount.toLocaleString("en-US")}${why ? ` — ${why}` : ""}` });
  }
  console.log(`[line-order] ${result.orderNumber} keyed${result.confirmed ? ", money confirmed by its slip" : ", waiting for the money"}`);
  // Automation item 3: a keyed order whose slip confirmed it goes to Shipnity by itself while the owner's switches allow.
  const done = result.confirmed ? autoPushDone(await autoPushed(actor, result.orderNumber), "line-order") : "line-order";
  redirect(`/staff/orders/${encodeURIComponent(result.orderNumber)}?done=${done}`);
}

/** "เติมฟอร์มจากข้อความ" — read the admin's pasted LINE text into form values (line-order-paste-rules.ts). Saves nothing. */
export async function parsePasteAction(text: string): Promise<PasteResult | null> {
  if (!staffAreaEnabled() || !(await isStaff())) return null;
  const products = stockBook()
    .map((p) => ({ slug: p.slug, name: p.name, options: p.options.filter((o) => o.sells).map((o) => ({ id: o.id, name: o.name })) }))
    .filter((p) => p.options.length > 0);
  return parsePastedOrder(String(text).slice(0, 4000), products, placesForPostcode);
}

/** Why "แก้รายการสินค้า" did not save (src/lib/staff/line-order-edit.ts). Nothing is changed on any of these. */
const CHANGE_ERROR_TH: Record<string, string> = {
  "not-line": "แก้รายการได้เฉพาะออเดอร์ LINE ที่คีย์ในหลังบ้าน",
  status: "แก้รายการได้เฉพาะออเดอร์ที่รอยืนยันยอดหรือยืนยันยอดแล้ว และยังไม่ส่งคลัง — โหลดหน้าใหม่ดูสถานะล่าสุด",
  sent: "ออเดอร์นี้ส่งเข้าคลังแล้ว แก้ในเว็บไม่ได้ — แจ้งแอดมินคลังให้แก้ใน Shipnity",
  stock: "ออเดอร์นี้มีเรื่องสินค้าหมด แก้รายการไม่ได้ — ใช้กล่องสินค้าหมดหลังลูกค้าโอน",
  "not-found": "ไม่พบออเดอร์นี้",
  "only-add": "ลูกค้าโอนแล้ว เพิ่มได้อย่างเดียว — เอาของออกหรือลดจำนวน ใช้กล่องสินค้าหมดหลังลูกค้าโอน (คืนเงิน) หรือยกเลิก",
  item: "มีสินค้าที่ขายไม่ได้แล้ว — เอาออกแล้วเลือกใหม่",
  stockOut: "มีสินค้าที่หมดสต็อก — เอาออกหรือเลือกตัวเลือกอื่น",
  "slip-taken": "สลิปนี้ถูกใช้กับออเดอร์อื่นไปแล้ว — เลือกใบอื่น หรือเลือก ไม่มีสลิปในรายการ",
  "slip-amount": "ยอดสลิปไม่เท่ายอดที่ต้องโอนเพิ่ม — ตรวจรายการสินค้าหรือเลือกสลิปใบอื่น",
  "hand-confirm": "ออเดอร์นี้ยืนยันยอดแล้ว — เลือกสลิปส่วนต่าง หรือติ๊กว่าเห็นเงินส่วนต่างเข้าบัญชีร้านแล้ว",
  "no-change": "ยอดไม่เปลี่ยน — เพิ่มสินค้าก่อนบันทึก",
  items: "เลือกสินค้าอย่างน้อย 1 รายการ (ไม่เกิน 50 ชิ้นต่อรายการ)",
  by: "ใส่ชื่อคนแก้",
  "below-discount": "ยอดใหม่ต่ำกว่าส่วนลดราคาพิเศษ — ออเดอร์นี้ลดราคาไว้ เอาของออกแบบนี้ไม่ได้",
};

/** "แก้รายการสินค้า" on a keyed LINE order (LINE_ORDERS_GAPS.md #3) — then back to the order page. */
export async function changeItemsAction(_prev: LineOrderState, form: FormData): Promise<LineOrderState> {
  const actor = await actorOrBack();
  const orderNumber = String(form.get("orderNumber") ?? "");
  const items = parseItems(form.get("items"));
  if (!items) return { error: CHANGE_ERROR_TH.items };
  const by = nameOf(actor, String(form.get("by") ?? "").trim().replace(/\s+/g, " ").slice(0, 40));
  if (!by) return { error: CHANGE_ERROR_TH.by };
  const ref = String(form.get("slipRef") ?? "").trim().slice(0, 80);
  const result = changeLineOrderItems({ orderNumber, items, slipRef: ref && ref !== "none" ? ref : null, handConfirmed: form.get("handConfirmed") === "1", by });
  if (!result.ok) return { error: CHANGE_ERROR_TH[result.error === "stock" ? "stockOut" : result.error] };
  recordStaffAction(actor, "order-items", { orderNumber, detail: `฿${result.oldTotal.toLocaleString("en-US")} → ฿${result.newTotal.toLocaleString("en-US")}` });
  console.log(`[line-order] ${orderNumber} items changed${result.confirmed ? ", money confirmed by its slips" : ""}`);
  const from = String(form.get("from") ?? "");
  const done = result.confirmed ? autoPushDone(await autoPushed(actor, orderNumber), "items") : "items";
  redirect(`/staff/orders/${encodeURIComponent(orderNumber)}?${isStaffJob(from) || from === "all" ? `from=${from}&` : ""}done=${done}`);
}
