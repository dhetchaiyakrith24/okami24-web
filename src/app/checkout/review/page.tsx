import type { Metadata } from "next";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { getSession } from "@/lib/commerce/session";
import { getOwnedAddress } from "@/lib/commerce/addresses";
import { getCart } from "@/lib/commerce/cart";
import { ReviewStepView } from "@/components/commerce/ReviewStepView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Checkout — Review",
  description: "Checkout — OKami24.",
  ...canonicalFor("/checkout/review"),
  ...NOINDEX_FOLLOW,
};

export default async function CheckoutReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ addressId?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/checkout");

  const { addressId: addressIdRaw, error } = await searchParams;
  const addressId = Number(addressIdRaw);
  if (!addressIdRaw || Number.isNaN(addressId)) redirect("/checkout/address");

  const address = await getOwnedAddress(addressId);
  if (!address) redirect(`/checkout/address?error=${encodeURIComponent("Address not found.")}`);

  const cart = await getCart();
  if (cart.lines.length === 0 || cart.hasProblems) redirect("/cart");

  // Fresh per page load — a single review page instance's hidden field stays the same value
  // across a double-click submit of that instance, which is exactly the case checkout
  // idempotency needs to guard. See placeOrder() in src/lib/commerce/orders.ts.
  const idempotencyKey = crypto.randomUUID();

  return <ReviewStepView cart={cart} address={address} addressId={addressId} idempotencyKey={idempotencyKey} error={error} />;
}
