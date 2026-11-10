import "server-only";
import type { StaffActor } from "@/lib/staff/account-rules";
import { recordStaffAction } from "@/lib/staff/audit";
import { withTypedName } from "@/lib/staff/audit-rules";
import { autoPushAfterConfirm, type AutoPushOutcome } from "@/lib/woo/auto-push";

/** The automatic send to Shipnity after a confirm (automation item 3, owner 10/11), recorded in "ใครทำอะไร" under the person
 *  who confirmed — so the owner sees who sent which order to the warehouse even when nobody pressed that button. */
export async function autoPushed(actor: StaffActor, orderNumber: string, typedName = ""): Promise<AutoPushOutcome> {
  const outcome = await autoPushAfterConfirm(orderNumber);
  if (outcome.sent) recordStaffAction(actor, "order-shipnity", { orderNumber, detail: withTypedName(actor.kind, typedName, "ส่งเองอัตโนมัติหลังยืนยันเงิน") });
  return outcome;
}
