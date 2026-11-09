"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readSwitches, writeSwitches } from "@/lib/commerce/shop-switches";
import { isOwner } from "@/lib/owner/auth";
import { OWNER_NAME, type StaffActor } from "@/lib/staff/account-rules";
import { addAccount, renameAccount, setAccountActive } from "@/lib/staff/accounts";
import { recordStaffAction } from "@/lib/staff/audit";
import { openOwnerStaffSession } from "@/lib/staff/auth";

/** The owner's "ทีมงาน" page (/staff/owner/team, owner 10/11). Every action checks the owner's session itself and is recorded
 *  under "เจ้าของ" in "ใครทำอะไร". Addresses never reach a log line. */

const OWNER: StaffActor = { kind: "owner", accountId: null, name: OWNER_NAME };
const TEAM = "/staff/owner/team";

export type AddAdminState = { error: string | null; added?: string };

const ADD_ERROR: Record<string, string> = {
  name: "ใส่ชื่อ 1–30 ตัวอักษร (ห้ามใช้คำว่า เจ้าของ หรือ รหัสร่วม)",
  email: "อีเมลไม่ถูกต้อง",
  taken: "อีเมลนี้อยู่ในทีมแล้ว",
};

export async function addAdminAction(_prev: AddAdminState, form: FormData): Promise<AddAdminState> {
  if (!(await isOwner())) return { error: "กรุณาเข้าสู่ระบบใหม่" };
  const result = addAccount(form.get("name"), form.get("email"));
  if (!result.ok) return { error: ADD_ERROR[result.error] ?? "บันทึกไม่ได้" };
  recordStaffAction(OWNER, "team-add", { detail: result.name });
  revalidatePath(TEAM);
  return { error: null, added: result.name };
}

const accountId = (form: FormData) => {
  const id = Number(form.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
};

export async function renameAdminAction(form: FormData): Promise<void> {
  if (!(await isOwner())) redirect("/staff/owner");
  const id = accountId(form);
  const result = id ? renameAccount(id, form.get("name")) : null;
  if (result?.ok) recordStaffAction(OWNER, "team-rename", { detail: result.name });
  revalidatePath(TEAM);
  redirect(result?.ok ? TEAM : `${TEAM}?error=name`);
}

export async function setAdminActiveAction(form: FormData): Promise<void> {
  if (!(await isOwner())) redirect("/staff/owner");
  const id = accountId(form);
  const active = form.get("value") === "on";
  const result = id ? setAccountActive(id, active) : null;
  if (result?.ok) recordStaffAction(OWNER, active ? "team-enable" : "team-disable", { detail: result.name });
  revalidatePath(TEAM);
  redirect(TEAM);
}

/** The shared team password: off ends every session it opened at once (src/lib/staff/auth.ts checks the switch live). */
export async function setSharedPasswordAction(form: FormData): Promise<void> {
  if (!(await isOwner())) redirect("/staff/owner");
  const open = form.get("value") === "on";
  writeSwitches({ ...readSwitches(), staffPasswordOff: !open });
  recordStaffAction(OWNER, open ? "shared-password-on" : "shared-password-off");
  console.log(`[switches] owner set staff password ${open ? "on" : "off"}`);
  revalidatePath(TEAM);
  redirect(TEAM);
}

/** "มุมแอดมิน": the owner steps into the admin view with the sign-in already made. What the owner does there is recorded as "เจ้าของ". */
export async function ownerToAdminAction(): Promise<void> {
  if (!(await isOwner())) redirect("/staff/owner");
  await openOwnerStaffSession();
  redirect("/staff");
}
