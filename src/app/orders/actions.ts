"use server";

import { redirect } from "next/navigation";
import { signInToTrackOrders } from "@/lib/commerce/order-lookup";
import { allowPhoneAttempt } from "@/lib/commerce/phone-rate-limit";

export interface OrderLookupState {
  /** A key of `dict.orderLookup` to show under the field, or null. */
  errorKey: "errorInvalidPhone" | "errorNotFound" | "errorTooManyTries" | null;
  phone: string;
}

/** The phone form on /orders: on a match the visitor is signed in as that customer and the page lists their orders.
 *  Rate-limited per visitor (owner 24/10 proposal ⑤) — see src/lib/commerce/phone-rate-limit.ts. */
export async function orderLookupAction(_prev: OrderLookupState, formData: FormData): Promise<OrderLookupState> {
  const phone = String(formData.get("phone") ?? "");
  if (!(await allowPhoneAttempt())) return { phone, errorKey: "errorTooManyTries" };
  const result = await signInToTrackOrders(phone);
  if (result.ok) redirect("/orders");
  return { phone, errorKey: result.error === "invalid-phone" ? "errorInvalidPhone" : "errorNotFound" };
}
