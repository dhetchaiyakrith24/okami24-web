"use server";

import { redirect, RedirectType } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requestOtp, signInWithoutOtp, verifyOtp } from "@/lib/commerce/auth";
import { OTP_VERIFICATION_ENABLED } from "@/lib/commerce/otp-mode";
import { ORDERING_ENABLED, ORDERING_PAUSED_REDIRECT } from "@/lib/commerce/ordering-mode";
import { allowPhoneAttempt } from "@/lib/commerce/phone-rate-limit";

/** Online ordering off (owner 2026-09-07): every step that moves a visitor towards a NEW order
 *  refuses, the same way the checkout pages do. Paying for an order that already exists is not
 *  guarded — that is the slip upload (POST /orders/<n>/slip, cart round 22/10), which replaced the
 *  old "I have paid" note action. See src/lib/commerce/ordering-mode.ts. */
function refuseWhileOrderingOff(): void {
  if (!ORDERING_ENABLED) redirect(ORDERING_PAUSED_REDIRECT);
}
import { addAddress, type AddressInput } from "@/lib/commerce/addresses";
import { placeOrder } from "@/lib/commerce/orders";

export interface OtpFormState {
  step: "phone" | "code";
  phone: string;
  errorKey: string | null;
}

// NOTE: no `initialOtpState` constant here — a "use server" file may only export async functions
// (every other export is treated as a server-action reference by the compiler); a plain object
// export is invalid and silently resolves to something other than the object on the client side,
// which manifested as PhoneVerifyForm rendering the "code" step on first load with no submission
// ever happening. The initial value now lives in PhoneVerifyForm.tsx itself, next to its only use.

/**
 * A single `useActionState`-bound action for the whole phone-verify step, branching on a hidden
 * `intent` field rather than being split into two actions — `useActionState` binds one action to
 * one piece of state, and this step's "phone" and "code" sub-forms need to share that state (the
 * code sub-form must remember the phone number the code was sent to). See PhoneVerifyForm.tsx.
 *
 * Leaving the step REPLACES /checkout in the history (cart-ready round 24/10): /checkout redirects a signed-in visitor
 * forward again, so with a normal push the phone's Back button from the review step bounced straight back to it
 * (checker #795).
 */
export async function otpStepAction(prev: OtpFormState, formData: FormData): Promise<OtpFormState> {
  refuseWhileOrderingOff();
  const intent = String(formData.get("intent") ?? "request");

  if (intent === "request") {
    const phone = String(formData.get("phone") ?? "");

    // Verification switched off (owner 2026-09-06, BSOT §9): the code step would be a dead end
    // with no SMS provider, so the phone number alone opens the session and checkout continues.
    // That makes this a place where a number alone opens a customer's session — rate-limited (owner 24/10 proposal ⑤).
    if (!OTP_VERIFICATION_ENABLED) {
      if (!(await allowPhoneAttempt())) return { step: "phone", phone, errorKey: "errorTooManyTries" };
      const signIn = await signInWithoutOtp(phone);
      if (!signIn.ok) return { step: "phone", phone, errorKey: "errorInvalidPhone" };
      redirect("/checkout/address", RedirectType.replace);
    }

    const result = await requestOtp(phone);
    if (!result.ok) {
      return { step: "phone", phone, errorKey: result.error === "invalid-phone" ? "errorInvalidPhone" : "errorRateLimited" };
    }
    return { step: "code", phone, errorKey: null };
  }

  if (intent === "change-number") {
    return { step: "phone", phone: "", errorKey: null };
  }

  // intent === "verify"
  const phone = String(formData.get("phone") ?? prev.phone);
  const code = String(formData.get("code") ?? "");
  const result = await verifyOtp(phone, code);
  if (!result.ok) {
    const key: Record<string, string> = {
      "invalid-phone": "errorInvalidPhone",
      "no-pending-code": "errorNoPendingCode",
      expired: "errorExpired",
      "too-many-attempts": "errorTooManyAttempts",
      "incorrect-code": "errorIncorrectCode",
    };
    return { step: "code", phone, errorKey: key[result.error] ?? "errorIncorrectCode" };
  }
  redirect("/checkout/address", RedirectType.replace);
}

const ADDRESS_FIELDS = ["recipientName", "phone", "line1", "subdistrict", "district", "province", "postalCode"] as const;

export interface AddressFormState {
  /** A key of `dict.checkout`, or null. */
  errorKey: "addressErrorMissing" | "addressErrorPhone" | "addressErrorPostal" | null;
  /** What the customer typed — the form shows it again after a refusal instead of emptying every field (LESSONS พ45). */
  values: Partial<Record<(typeof ADDRESS_FIELDS)[number], string>>;
}

export async function addAddressAction(_prev: AddressFormState, formData: FormData): Promise<AddressFormState> {
  refuseWhileOrderingOff();
  const values = Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, String(formData.get(k) ?? "")])) as Record<(typeof ADDRESS_FIELDS)[number], string>;
  const input: AddressInput = values;
  const result = await addAddress(input, true);
  if (!result.ok) {
    const errorKey = result.error === "phone" ? "addressErrorPhone" : result.error === "postal" ? "addressErrorPostal" : "addressErrorMissing";
    return { errorKey, values };
  }
  // Replace: /checkout/address now jumps to review for a customer with an address, so a pushed entry here made Back
  // from review bounce straight back to it (checker #811, the #795 loop for a NEW customer).
  redirect(`/checkout/review?addressId=${result.id}`, RedirectType.replace);
}

export async function selectAddressAction(formData: FormData): Promise<void> {
  refuseWhileOrderingOff();
  const addressId = Number(formData.get("addressId"));
  redirect(`/checkout/review?addressId=${addressId}`);
}

export interface PlaceOrderState {
  /** A key of `dict.checkout`, or null. */
  errorKey: "placeErrorBusy" | "placeErrorAddress" | "placeErrorShippingChanged" | null;
}

/**
 * The review step's "ยืนยันคำสั่งซื้อ". Returns its refusal to the page instead of redirecting with an English sentence in
 * the URL (cart-ready round 24/10): the page keeps the customer's typed note (checker #795: it was lost) and shows the
 * reason in Thai. A cart that changed meanwhile (empty / an item no longer sold) goes back to the cart page, which shows
 * what changed.
 */
export async function placeOrderAction(_prev: PlaceOrderState, formData: FormData): Promise<PlaceOrderState> {
  refuseWhileOrderingOff();
  const addressId = Number(formData.get("addressId"));
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  // Optional note to the shop (cart UX batch C) — cleaned and capped inside placeOrder.
  const customerNote = formData.get("customerNote");
  // The fee the review step showed (shipping tiers, owner 29/10) — compared inside placeOrder, never charged.
  const shownRaw = formData.get("shownShippingFee");
  const shown = typeof shownRaw === "string" && /^\d+$/.test(shownRaw) ? Number(shownRaw) : null;
  const result = await placeOrder(addressId, idempotencyKey, typeof customerNote === "string" ? customerNote : null, shown);
  if (!result.ok) {
    if (result.code === "empty-cart" || result.code === "cart-has-problems") redirect("/cart", RedirectType.replace);
    if (result.code === "shipping-changed") {
      // Re-render the review step with the new fee and its reason; the typed note stays (controlled state on the page).
      revalidatePath("/checkout/review");
      return { errorKey: "placeErrorShippingChanged" };
    }
    return { errorKey: result.code === "address-not-found" ? "placeErrorAddress" : "placeErrorBusy" };
  }
  // Replace: Back from the order page must not reopen a review step whose cart is already ordered.
  redirect(`/orders/${result.order.orderNumber}?token=${result.order.viewToken}`, RedirectType.replace);
}
