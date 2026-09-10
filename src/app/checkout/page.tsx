import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/commerce/session";
import { OTP_VERIFICATION_ENABLED } from "@/lib/commerce/otp-mode";
import { PhoneVerifyForm } from "@/components/commerce/PhoneVerifyForm";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { ORDERING_ENABLED, ORDERING_PAUSED_REDIRECT } from "@/lib/commerce/ordering-mode";

export const metadata: Metadata = {
  title: "ชำระเงิน",
  description: "ชำระเงิน — OKami24",
  ...canonicalFor("/checkout"),
  ...NOINDEX_FOLLOW,
};

export default async function CheckoutPage() {
  // Online ordering off (owner 2026-09-07) — see src/lib/commerce/ordering-mode.ts.
  if (!ORDERING_ENABLED) redirect(ORDERING_PAUSED_REDIRECT);
  const session = await getSession();
  if (session) redirect("/checkout/address");
  return <PhoneVerifyForm otpEnabled={OTP_VERIFICATION_ENABLED} />;
}
