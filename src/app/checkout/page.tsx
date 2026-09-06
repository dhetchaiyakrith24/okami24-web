import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/commerce/session";
import { OTP_VERIFICATION_ENABLED } from "@/lib/commerce/otp-mode";
import { PhoneVerifyForm } from "@/components/commerce/PhoneVerifyForm";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout — OKami24.",
  ...canonicalFor("/checkout"),
  ...NOINDEX_FOLLOW,
};

export default async function CheckoutPage() {
  const session = await getSession();
  if (session) redirect("/checkout/address");
  return <PhoneVerifyForm otpEnabled={OTP_VERIFICATION_ENABLED} />;
}
