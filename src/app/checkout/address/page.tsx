import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/commerce/session";
import { listAddresses } from "@/lib/commerce/addresses";
import { AddressStepView } from "@/components/commerce/AddressStepView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Checkout — Address",
  description: "Checkout — OKami24.",
  ...canonicalFor("/checkout/address"),
  ...NOINDEX_FOLLOW,
};

export default async function CheckoutAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/checkout");

  const { error } = await searchParams;
  const addresses = await listAddresses();
  return <AddressStepView addresses={addresses} error={error} />;
}
