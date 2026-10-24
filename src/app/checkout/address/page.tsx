import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/commerce/session";
import { listAddresses, lastUsedAddressId } from "@/lib/commerce/addresses";
import { AddressStepView } from "@/components/commerce/AddressStepView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { ORDERING_ENABLED, ORDERING_PAUSED_REDIRECT } from "@/lib/commerce/ordering-mode";

export const metadata: Metadata = {
  title: "ชำระเงิน: ที่อยู่จัดส่ง",
  description: "ชำระเงิน — OKami24",
  ...canonicalFor("/checkout/address"),
  ...NOINDEX_FOLLOW,
};

export default async function CheckoutAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; choose?: string }>;
}) {
  // Online ordering off (owner 2026-09-07) — see src/lib/commerce/ordering-mode.ts.
  if (!ORDERING_ENABLED) redirect(ORDERING_PAUSED_REDIRECT);
  if (!(await getSession())) redirect("/checkout");

  const { error, choose } = await searchParams;
  const addresses = await listAddresses();
  // Cart UX batch C (owner 24/10): a returning customer goes straight to the review step with their last-used address.
  // Not when they asked to choose ("เปลี่ยนที่อยู่" on the review step sends ?choose=1) or came back with an error.
  // `saved=1` tells the review step this address was picked FOR them, so it asks "ส่งที่อยู่เดิมนี้ใช่ไหม" (owner idea, d).
  if (!choose && !error) {
    const lastId = await lastUsedAddressId(addresses);
    if (lastId !== null) redirect(`/checkout/review?addressId=${lastId}&saved=1`);
  }
  const session = await getSession();
  return <AddressStepView addresses={addresses} addressMissing={error === "not-found"} defaultPhone={session?.phone ?? ""} />;
}
