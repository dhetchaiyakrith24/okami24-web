"use server";

import { redirect } from "next/navigation";
import { requestOtp, signInWithoutOtp, verifyOtp } from "@/lib/commerce/auth";
import { OTP_VERIFICATION_ENABLED } from "@/lib/commerce/otp-mode";
import { ORDERING_ENABLED, ORDERING_PAUSED_REDIRECT } from "@/lib/commerce/ordering-mode";

/** Online ordering off (owner 2026-09-07): every step that moves a visitor towards a NEW order
 *  refuses, the same way the checkout pages do. `submitPaymentAction` is deliberately NOT guarded —
 *  it belongs to an order that already exists (the owner's test order, any earlier customer), and
 *  "I have paid" must keep working for those. See src/lib/commerce/ordering-mode.ts. */
function refuseWhileOrderingOff(): void {
  if (!ORDERING_ENABLED) redirect(ORDERING_PAUSED_REDIRECT);
}
import { addAddress, type AddressInput } from "@/lib/commerce/addresses";
import { placeOrder, submitPaymentClaim } from "@/lib/commerce/orders";

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
 */
export async function otpStepAction(prev: OtpFormState, formData: FormData): Promise<OtpFormState> {
  refuseWhileOrderingOff();
  const intent = String(formData.get("intent") ?? "request");

  if (intent === "request") {
    const phone = String(formData.get("phone") ?? "");

    // Verification switched off (owner 2026-09-06, BSOT §9): the code step would be a dead end
    // with no SMS provider, so the phone number alone opens the session and checkout continues.
    if (!OTP_VERIFICATION_ENABLED) {
      const signIn = await signInWithoutOtp(phone);
      if (!signIn.ok) return { step: "phone", phone, errorKey: "errorInvalidPhone" };
      redirect("/checkout/address");
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
  redirect("/checkout/address");
}

export async function addAddressAction(formData: FormData): Promise<void> {
  refuseWhileOrderingOff();
  const input: AddressInput = {
    recipientName: String(formData.get("recipientName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    subdistrict: String(formData.get("subdistrict") ?? ""),
    district: String(formData.get("district") ?? ""),
    province: String(formData.get("province") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
  };
  const result = await addAddress(input, true);
  if (!result.ok) {
    redirect(`/checkout/address?error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/checkout/review?addressId=${result.id}`);
}

export async function selectAddressAction(formData: FormData): Promise<void> {
  refuseWhileOrderingOff();
  const addressId = Number(formData.get("addressId"));
  redirect(`/checkout/review?addressId=${addressId}`);
}

export async function placeOrderAction(formData: FormData): Promise<void> {
  refuseWhileOrderingOff();
  const addressId = Number(formData.get("addressId"));
  const idempotencyKey = String(formData.get("idempotencyKey") ?? "");
  const result = await placeOrder(addressId, idempotencyKey);
  if (!result.ok) {
    redirect(`/checkout/review?addressId=${addressId}&error=${encodeURIComponent(result.error)}`);
  }
  redirect(`/orders/${result.order.orderNumber}?token=${result.order.viewToken}`);
}

export async function submitPaymentAction(formData: FormData): Promise<void> {
  const orderNumber = String(formData.get("orderNumber") ?? "");
  const token = String(formData.get("token") ?? "");
  const note = String(formData.get("note") ?? "");
  const result = await submitPaymentClaim(orderNumber, token || null, note);

  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (!result.ok) params.set("error", result.error);
  const qs = params.toString();
  redirect(`/orders/${orderNumber}${qs ? `?${qs}` : ""}`);
}
