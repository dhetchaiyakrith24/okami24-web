import "server-only";
import { readSwitches } from "@/lib/commerce/shop-switches";
import { applyStaffAction, getStaffOrder } from "@/lib/staff/orders";
import { pushOrder, shipnityReady, type PushResult } from "@/lib/woo/order-push";
import { autoPushSkip, type AutoPushSkip } from "@/lib/woo/auto-push-rules";

/**
 * After staff confirmed the money: send the order to Shipnity by itself when the owner's switch says so (rules and why =
 * auto-push-rules.ts). Called by the staff actions right after a confirm, awaited (one send, 15 s at most per target — the
 * same call the button makes), so the page the admin lands on already says whether it went. Never throws.
 */
export type AutoPushOutcome = { sent: true } | { sent: false; skip: AutoPushSkip } | { sent: false; error: Exclude<PushResult, { ok: true }>["error"] };

export async function autoPushAfterConfirm(orderNumber: string): Promise<AutoPushOutcome> {
  try {
    const order = getStaffOrder(orderNumber);
    if (!order) return { sent: false, error: "not-found" };
    const sw = readSwitches();
    const skip = autoPushSkip({ autoOn: sw.autoToWarehouse, shipnityReady: shipnityReady(), channel: order.channel, lineSwitchOn: sw.lineToWarehouse });
    if (skip) return { sent: false, skip };
    const pushed = await pushOrder(orderNumber);
    if (!pushed.ok) {
      console.log(`[auto-push] ${orderNumber} not sent: ${pushed.error}`);
      return { sent: false, error: pushed.error };
    }
    // The same step the button records ("ส่งรายการให้คลังแล้ว"), marked as the system's.
    applyStaffAction(orderNumber, "to-warehouse", { note: "ส่งเข้า Shipnity อัตโนมัติหลังยืนยันยอด" });
    console.log(`[auto-push] ${orderNumber} sent to Shipnity`);
    return { sent: true };
  } catch (e) {
    console.log(`[auto-push] ${orderNumber} error: ${e instanceof Error ? e.message : String(e)}`);
    return { sent: false, error: "failed" };
  }
}

/** The order page's `done=` key after a confirm: the plain one when nothing was meant to go (switch off …), "-sent" when it
 *  went, "-autofail" when it was meant to go and did not (the page then says to press the send button / check Shipnity). */
export function autoPushDone(outcome: AutoPushOutcome, base: string): string {
  if (outcome.sent) return `${base}-sent`;
  return "skip" in outcome ? base : `${base}-autofail`;
}
