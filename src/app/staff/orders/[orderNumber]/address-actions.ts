"use server";

import { redirect } from "next/navigation";
import { currentStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { nameOf } from "@/lib/staff/account-rules";
import { recordStaffAction } from "@/lib/staff/audit";
import { isStaffJob } from "@/lib/staff/jobs";
import { changeShippingAddress } from "@/lib/staff/order-address";

export interface AddressEditState {
  error: string | null;
}

/** Why "แก้ที่อยู่จัดส่ง" did not save (src/lib/staff/order-address.ts). Nothing is changed on any of these. */
const ERROR_TH: Record<string, string> = {
  "not-found": "ไม่พบออเดอร์นี้",
  locked: "ออเดอร์นี้ส่งคลังแล้ว แก้ในเว็บไม่ได้ — แก้ใน Shipnity หรือแจ้งแอดมินคลัง",
  same: "ที่อยู่เหมือนเดิม — ยังไม่ได้แก้อะไร",
  missing: "กรอกชื่อผู้รับ เบอร์ ที่อยู่ ตำบล อำเภอ จังหวัด ให้ครบ",
  phone: "เบอร์ผู้รับไม่ถูกต้อง — มือถือ 10 หลัก หรือเบอร์บ้าน 9 หลัก",
  houseNumber: "ที่อยู่ต้องมีบ้านเลขที่",
  postal: "รหัสไปรษณีย์ไม่ตรงกับจังหวัด",
  by: "ใส่ชื่อคนแก้",
};

const text = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().replace(/\s+/g, " ").slice(0, max);

/** "แก้ที่อยู่จัดส่ง" on /staff/orders/<n> (LINE_ORDERS_GAPS.md #7) — then back to the order page. */
export async function changeAddressAction(_prev: AddressEditState, form: FormData): Promise<AddressEditState> {
  const actor = staffAreaEnabled() ? await currentStaff() : null;
  if (!actor) redirect("/staff");
  const orderNumber = text(form.get("orderNumber"), 60);
  const by = nameOf(actor, text(form.get("by"), 40));
  if (!by) return { error: ERROR_TH.by };
  const result = changeShippingAddress(
    orderNumber,
    {
      recipientName: text(form.get("recipientName"), 80),
      phone: text(form.get("phone"), 20),
      line1: text(form.get("line1"), 200),
      subdistrict: text(form.get("subdistrict"), 80),
      district: text(form.get("district"), 80),
      province: text(form.get("province"), 80),
      postalCode: text(form.get("postalCode"), 5),
    },
    by
  );
  if (!result.ok) return { error: ERROR_TH[result.error] };
  recordStaffAction(actor, "order-address", { orderNumber });
  const from = text(form.get("from"), 20);
  redirect(`/staff/orders/${encodeURIComponent(orderNumber)}?${isStaffJob(from) || from === "all" ? `from=${from}&` : ""}done=address`);
}
