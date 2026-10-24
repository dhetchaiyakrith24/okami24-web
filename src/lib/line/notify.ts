import "server-only";
import { getOrderDetailInternal } from "@/lib/commerce/orders";
import type { SlipReason, SlipVerdict } from "@/lib/commerce/slip-decision";
import { SITE_URL } from "@/lib/seo";
import { lineConfigured, pushText } from "./client";
import { groupForRole } from "./groups";
import { formatOrderAlert, formatStockChoiceAlert } from "./messages";

/**
 * New-order alert into the team's "OKM Order" group (owner 22/10). Sent once, when the customer's slip is in — an
 * order that is never paid never pings the team (it still shows on /staff). A push counts against the bot's free
 * monthly quota, once per group member (developers.line.biz/en/docs/messaging-api/pricing/), so pushes stay rare:
 * this one and notifyStockChoice below. Never throws: a failed alert is logged and the order stays exactly as it is.
 */
export async function notifyPaidOrder(orderNumber: string, verdict: SlipVerdict, reasons: SlipReason[]): Promise<void> {
  try {
    if (!lineConfigured()) return;
    const groupId = groupForRole("order");
    if (!groupId) {
      console.warn(`[line] order ${orderNumber}: no group marked "order" yet — alert not sent`);
      return;
    }
    const order = getOrderDetailInternal(orderNumber);
    if (!order) return;
    const result = await pushText(groupId, formatOrderAlert(order, verdict, reasons, SITE_URL));
    if (!result.ok) console.error(`[line] order ${orderNumber}: push failed (${result.status ?? "network"})`);
  } catch (err) {
    console.error(`[line] order ${orderNumber}: alert threw — ${err instanceof Error ? err.message : String(err)}`);
  }
}

/** Out of stock after payment (cart UX batch E, owner 24/10): the customer chose swap or refund on the order page — staff act
 *  on it. Rare (only orders staff marked out). Never throws. */
export async function notifyStockChoice(orderNumber: string, choice: "swap" | "refund"): Promise<void> {
  try {
    if (!lineConfigured()) return;
    const groupId = groupForRole("order");
    if (!groupId) return;
    const result = await pushText(groupId, formatStockChoiceAlert(orderNumber, choice, SITE_URL));
    if (!result.ok) console.error(`[line] stock choice ${orderNumber}: push failed (${result.status ?? "network"})`);
  } catch (err) {
    console.error(`[line] stock choice ${orderNumber}: alert threw — ${err instanceof Error ? err.message : String(err)}`);
  }
}
