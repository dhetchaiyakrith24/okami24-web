"use server";

import { after } from "next/server";
import { chooseRefund, chooseSwap, type CustomerStockResult } from "@/lib/commerce/stock-issues";
import { notifyStockChoice } from "@/lib/line/notify";

/**
 * The customer's answer on the order page when staff marked items out after payment (cart UX batch E, owner 24/10):
 * swap for a same-price item, or a refund to PromptPay. Access = the same check as the order page (owning customer or
 * the order's view token, sent back from the page) — inside chooseSwap / chooseRefund.
 */

export interface StockActionState {
  /** A key of `dict.orderStatus` to show, or null. */
  errorKey: "stockErrorSwap" | "stockErrorPromptPay" | "stockErrorClosed" | null;
  done: boolean;
}

const ERROR_KEY: Record<Exclude<CustomerStockResult, { ok: true }>["error"], StockActionState["errorKey"]> = {
  "not-found": "stockErrorClosed",
  closed: "stockErrorClosed",
  "swap-invalid": "stockErrorSwap",
  "promptpay-invalid": "stockErrorPromptPay",
};

function answer(orderNumber: string, result: CustomerStockResult): StockActionState {
  if (!result.ok) return { errorKey: ERROR_KEY[result.error], done: false };
  // The team's "OKM Order" group hears about it after the customer already has their answer.
  after(() => notifyStockChoice(orderNumber, result.choice));
  return { errorKey: null, done: true };
}

export async function chooseSwapAction(_prev: StockActionState, formData: FormData): Promise<StockActionState> {
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const token = String(formData.get("token") ?? "") || null;
  const values = new Map<number, unknown>();
  for (const [key, value] of formData.entries()) {
    const m = /^swap-(\d+)$/.exec(key);
    if (m) values.set(Number(m[1]), value);
  }
  return answer(orderNumber, await chooseSwap(orderNumber, token, values));
}

export async function chooseRefundAction(_prev: StockActionState, formData: FormData): Promise<StockActionState> {
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const token = String(formData.get("token") ?? "") || null;
  const promptPay = formData.get("mode") === "other" ? formData.get("promptPay") : null;
  return answer(orderNumber, await chooseRefund(orderNumber, token, promptPay));
}
