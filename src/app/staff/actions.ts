"use server";

import { redirect } from "next/navigation";
import { isStaff, staffAreaEnabled, staffLogin, staffLogout } from "@/lib/staff/auth";
import { assignRole } from "@/lib/line/groups";
import { STAFF_ACTIONS, type StaffAction } from "@/lib/staff/order-actions";
import { applyStaffAction } from "@/lib/staff/orders";

export type StaffLoginState = { error: null | "wrong" | "locked" | "empty"; retryMinutes?: number };

export async function staffLoginAction(_prev: StaffLoginState, formData: FormData): Promise<StaffLoginState> {
  if (!staffAreaEnabled()) return { error: "wrong" };
  const password = formData.get("password");
  if (typeof password !== "string" || password.trim() === "") return { error: "empty" };
  // Passwords are compared as typed (trimmed: a phone keyboard often adds a trailing space).
  const result = await staffLogin(password.trim().slice(0, 200));
  if (!result.ok) return { error: result.reason, retryMinutes: result.retryMinutes };
  redirect("/staff");
}

export async function staffLogoutAction(): Promise<void> {
  await staffLogout();
  redirect("/staff");
}

/** Mark one of the alert bot's LINE groups as the order group or the slip group (cart round 22/10). */
export async function assignLineGroupAction(formData: FormData): Promise<void> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const groupId = String(formData.get("groupId") ?? "");
  const role = String(formData.get("role") ?? "");
  assignRole(groupId, role === "order" || role === "slip" ? role : null);
  redirect("/staff#line-groups");
}

/** One button on /staff/orders/<n> (cart round 22/10): confirm payment · sent to warehouse · shipped + tracking ·
 *  completed · cancel (with a reason). The rules are in src/lib/staff/order-actions.ts. */
export async function staffOrderAction(formData: FormData): Promise<void> {
  if (!staffAreaEnabled() || !(await isStaff())) redirect("/staff");
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const action = String(formData.get("action") ?? "");
  const back = `/staff/orders/${encodeURIComponent(orderNumber)}`;
  if (!(action in STAFF_ACTIONS)) redirect(`${back}?error=not-allowed`);
  const result = applyStaffAction(orderNumber, action as StaffAction, {
    tracking: String(formData.get("tracking") ?? ""),
    carrier: String(formData.get("carrier") ?? ""),
    note: String(formData.get("note") ?? ""),
  });
  redirect(result.ok ? `${back}?done=${action}` : `${back}?error=${result.error}`);
}
