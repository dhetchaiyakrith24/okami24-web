"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentStaff, staffAreaEnabled, staffLogin, staffLogout } from "@/lib/staff/auth";
import type { StaffActor } from "@/lib/staff/account-rules";
import { recordStaffAction } from "@/lib/staff/audit";
import { ORDER_STEP_AUDIT, orderStepDetail, refTail } from "@/lib/staff/audit-rules";
import { assignRole, GROUP_ROLES, type GroupRole } from "@/lib/line/groups";
import { handoverNeedsTick, STAFF_ACTIONS, warehouseMayHaveIt, type StaffAction } from "@/lib/staff/order-actions";
import { editStateOf } from "@/lib/staff/line-order-edit";
import { applyStaffAction, getStaffOrder, setPlannedCarrier } from "@/lib/staff/orders";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { isStaffJob } from "@/lib/staff/jobs";
import { landing } from "@/lib/staff/admin-home-rules";
import { applySwap, markRefunded, openStockIssue } from "@/lib/commerce/stock-issues";
import { addCustomerMessage } from "@/lib/commerce/order-messages";
import { pushOrder, shipnityReady } from "@/lib/woo/order-push";
import { autoPushDone } from "@/lib/woo/auto-push";
import { autoPushed } from "@/lib/staff/auto-push-audit";

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

/** Who is pressing — every action below starts here (owner 10/11: each admin's own account, recorded in "ใครทำอะไร"). */
async function actorOrBack(): Promise<StaffActor> {
  const actor = staffAreaEnabled() ? await currentStaff() : null;
  if (!actor) redirect("/staff");
  return actor;
}

export async function staffLogoutAction(): Promise<void> {
  await staffLogout();
  redirect("/staff");
}

/** Mark one of the alert bot's LINE groups as the order group or the slip group (cart round 22/10). */
export async function assignLineGroupAction(formData: FormData): Promise<void> {
  const actor = await actorOrBack();
  const groupId = String(formData.get("groupId") ?? "");
  const role = String(formData.get("role") ?? "");
  const known = (GROUP_ROLES as readonly string[]).includes(role);
  assignRole(groupId, known ? (role as GroupRole) : null);
  recordStaffAction(actor, "line-group", { detail: known ? role : "เอาออก" });
  // The redirect lands on the page the button is on; without this the client router reuses its cached /staff and the
  // box keeps the old role until a manual reload (seen live 23/10).
  revalidatePath("/staff");
  redirect("/staff#line-groups");
}

/** One button on /staff/orders/<n> (cart round 22/10): confirm payment · sent to warehouse · shipped + tracking ·
 *  completed · cancel (with a reason). The rules are in src/lib/staff/order-actions.ts. */
/** Where an order action lands: the same order page, still carrying the list it was opened from (`from`, owner 26/10 B3:
 *  Back must go back to that list) — or the admin home, for the buttons in its "ทำก่อน" queue (`from=home`, owner 10/11) —
 *  then `done=` / `error=` follow. Rules = src/lib/staff/admin-home-rules.ts. */
function orderPage(orderNumber: string, formData: FormData): string {
  return landing(orderNumber, String(formData.get("from") ?? ""), (v) => isStaffJob(v) || v === "all");
}

export async function staffOrderAction(formData: FormData): Promise<void> {
  const actor = await actorOrBack();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const action = String(formData.get("action") ?? "");
  const back = orderPage(orderNumber, formData);
  if (!(action in STAFF_ACTIONS)) redirect(`${back}error=not-allowed`);
  // LINE_ORDERS_GAPS.md #1 / #4 (src/lib/staff/order-actions.ts): the warehouse may hold the order → the admin ticks first.
  let note = String(formData.get("note") ?? "");
  const ticked = formData.get("warehouseTick") === "1";
  const order = action === "cancel" || action === "to-warehouse" ? getStaffOrder(orderNumber) : null;
  if (order && action === "cancel" && warehouseMayHaveIt({ status: order.status, channel: order.channel, sentToWarehouse: editStateOf(order.id).sentToWarehouse })) {
    if (!ticked) redirect(`${back}error=cancel-warehouse`);
    // The tick first (the note is cut at 300), then the staff note — or the reason, which is the history note when no staff
    // note is given (the "ยกเลิกแล้ว — …" banner reads it).
    const reason = note.trim() || String(formData.get("message") ?? "").replace(/\s+/g, " ").trim();
    note = ["warehouse: cancelled in Shipnity / told (ticked)", reason].filter(Boolean).join(" — ");
  }
  if (order && action === "to-warehouse" && handoverNeedsTick({ channel: order.channel, lineSwitchOn: readSwitches().lineToWarehouse, autoOn: readSwitches().autoToWarehouse, shipnityReady: shipnityReady() })) {
    if (!ticked) redirect(`${back}error=handover-tick`);
    note = ["keyed into Shipnity by hand (ticked)", note.trim()].filter(Boolean).join(" — ");
  }
  const input = {
    tracking: String(formData.get("tracking") ?? ""),
    carrier: String(formData.get("carrier") ?? ""),
    note,
    message: String(formData.get("message") ?? ""),
  };
  const result = applyStaffAction(orderNumber, action as StaffAction, input);
  if (!result.ok) redirect(`${back}error=${result.error}`);
  recordStaffAction(actor, ORDER_STEP_AUDIT[action as StaffAction], { orderNumber, detail: orderStepDetail(action, input) });
  // Automation item 3 (owner 10/11): a confirmed order goes to Shipnity by itself while the owner's switch is on — recorded
  // under the person who confirmed.
  if (action === "confirm") redirect(`${back}done=${autoPushDone(await autoPushed(actor, orderNumber), "confirm")}`);
  redirect(`${back}done=${action === "cancel" && order && ticked ? "cancel-warehouse" : action}`);
}

/** "ส่งเข้าคลัง Shipnity" (Shipnity link, owner 28/10): send the paid order to the warehouse's Shipnity, then record the
 *  same step as "ส่งรายการให้คลังแล้ว". A failed send changes nothing on the order — staff can still copy the text. */
export async function staffShipnityPushAction(formData: FormData): Promise<void> {
  const actor = await actorOrBack();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const back = orderPage(orderNumber, formData);
  // A LINE order goes to the warehouse from here only while the owner's switch is on (owner list ก11, way 2).
  if (getStaffOrder(orderNumber)?.channel === "line" && !readSwitches().lineToWarehouse) redirect(`${back}error=line-switch-off`);
  const pushed = await pushOrder(orderNumber);
  if (!pushed.ok) redirect(`${back}error=shipnity-${pushed.error}`);
  recordStaffAction(actor, "order-shipnity", { orderNumber });
  const step = applyStaffAction(orderNumber, "to-warehouse", { note: "ส่งเข้า Shipnity อัตโนมัติ" });
  // Sent, but the status moved meanwhile (another tab) — say so instead of a plain "done".
  redirect(step.ok ? `${back}done=shipnity` : `${back}error=shipnity-sent-status`);
}

/** "เปลี่ยนขนส่ง" (owner 30/10): staff change the carrier picked from the postcode, before the order goes to Shipnity. */
export async function staffCarrierAction(formData: FormData): Promise<void> {
  const actor = await actorOrBack();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const back = orderPage(orderNumber, formData);
  const result = setPlannedCarrier(orderNumber, formData.get("carrier"));
  if (result.ok) recordStaffAction(actor, "order-carrier", { orderNumber, detail: String(formData.get("carrier") ?? "").slice(0, 20) });
  redirect(result.ok ? `${back}done=carrier` : `${back}error=${result.error === "carrier" ? "carrier" : "carrier-locked"}`);
}

/** Out of stock after payment (cart UX batch E, owner 24/10): mark lines out (or ask again) · apply the customer's swap ·
 *  record the refund made in the bank app. The rules are in src/lib/commerce/stock-issues.ts. */
export async function staffStockAction(formData: FormData): Promise<void> {
  const actor = await actorOrBack();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const step = String(formData.get("step") ?? "");
  const back = orderPage(orderNumber, formData);
  const result =
    step === "open"
      ? openStockIssue(
          orderNumber,
          formData.getAll("itemId").map((v) => Number(v)),
          String(formData.get("note") ?? ""),
          formData.get("message")
        )
      : step === "swap"
        ? applySwap(orderNumber)
        : step === "refunded"
          ? markRefunded(orderNumber, String(formData.get("ref") ?? ""))
          : ({ ok: false, error: "not-allowed" } as const);
  if (result.ok) {
    const audit = step === "open" ? "stock-open" : step === "swap" ? "stock-swap" : "stock-refunded";
    // The bank reference only — the customer's account number is never copied into the record.
    recordStaffAction(actor, audit, { orderNumber, detail: step === "refunded" ? refTail(String(formData.get("ref") ?? "")) : null });
  }
  redirect(result.ok ? `${back}done=stock-${step}` : `${back}error=stock-${result.error}`);
}

/** "ข้อความถึงลูกค้า" on /staff/orders/<n> (owner 24/10): a message the customer reads on their order page. */
export async function staffMessageAction(formData: FormData): Promise<void> {
  const actor = await actorOrBack();
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const back = orderPage(orderNumber, formData);
  const result = addCustomerMessage(orderNumber, formData.get("message"));
  if (result.ok) recordStaffAction(actor, "order-message", { orderNumber });
  redirect(result.ok ? `${back}done=message#customer-messages` : `${back}error=${result.error}`);
}
