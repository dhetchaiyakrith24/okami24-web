"use server";

import { redirect } from "next/navigation";
import { signInToTrackOrders } from "@/lib/commerce/order-lookup";

export interface OrderLookupState {
  /** A key of `dict.orderLookup` to show under the field, or null. */
  errorKey: "errorInvalidPhone" | "errorNotFound" | null;
  phone: string;
}

/** The phone form on /orders: on a match the visitor is signed in as that customer and the page lists their orders. */
export async function orderLookupAction(_prev: OrderLookupState, formData: FormData): Promise<OrderLookupState> {
  const phone = String(formData.get("phone") ?? "");
  const result = await signInToTrackOrders(phone);
  if (result.ok) redirect("/orders");
  return { phone, errorKey: result.error === "invalid-phone" ? "errorInvalidPhone" : "errorNotFound" };
}
