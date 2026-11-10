/**
 * Sending a paid order to the warehouse by itself (owner 10/11, automation item 3: "once the admin confirms payment, a web or
 * keyed LINE order pushes to the warehouse automatically … no second click"). Pure, so the contract test runs it under plain
 * tsx; auto-push.ts runs it.
 *
 * WHEN: right after staff confirm the money (the confirm button, a keyed LINE order whose slip fitted, or items added with a
 * slip that covers the new total) — only while the owner's switch "ส่งเข้าคลังอัตโนมัติ" is on, Shipnity takes orders from us,
 * and, for a LINE order, the owner's LINE switch is on too. Everything else (paid, never sent, no open out-of-stock problem,
 * every line has a warehouse code) is pushOrder's own check, the same as the button.
 *
 * ONE TRY: a refused or failed send leaves the order paid with the page's usual "send to Shipnity" button and its failure
 * line, for staff to press again. A send that got no answer is never retried by itself: Shipnity may have taken it, and a
 * second send could ship it twice (the double-ship guard; staff check Shipnity first).
 *
 * THE OTHER HALF OF THE GUARD (order-actions.ts handoverNeedsTick): while this switch is on, handing an order over by hand
 * ("ส่งรายการให้คลังแล้ว") needs the admin's tick that they keyed it into Shipnity themselves — the system may already have.
 */

export type AutoPushSkip = "switch-off" | "no-shipnity" | "line-switch-off";

export function autoPushSkip(s: { autoOn: boolean; shipnityReady: boolean; channel: "web" | "line"; lineSwitchOn: boolean }): AutoPushSkip | null {
  if (!s.autoOn) return "switch-off";
  if (!s.shipnityReady) return "no-shipnity";
  if (s.channel === "line" && !s.lineSwitchOn) return "line-switch-off";
  return null;
}
