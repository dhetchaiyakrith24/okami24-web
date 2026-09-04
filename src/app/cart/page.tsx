import type { Metadata } from "next";
import { getCart } from "@/lib/commerce/cart";
import { CartView } from "@/components/commerce/CartView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your OKami24 cart.",
  ...canonicalFor("/cart"),
  ...NOINDEX_FOLLOW,
};

export default async function CartPage() {
  const cart = await getCart();
  return <CartView cart={cart} />;
}
