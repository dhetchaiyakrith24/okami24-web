import type { Metadata } from "next";
import { getCart } from "@/lib/commerce/cart";
import { CartView } from "@/components/commerce/CartView";
import { cartSuggestions } from "@/lib/commerce/cart-suggestions";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { redirect } from "next/navigation";
import { ORDERING_ENABLED, ORDERING_PAUSED_REDIRECT } from "@/lib/commerce/ordering-mode";

export const metadata: Metadata = {
  title: "ตะกร้าสินค้า",
  description: "ตะกร้าสินค้า — OKami24",
  ...canonicalFor("/cart"),
  ...NOINDEX_FOLLOW,
};

export default async function CartPage() {
  // Online ordering off (owner 2026-09-07): the cart is not shown — the visitor goes to the
  // catalogue with the "order on LINE" note. The cart itself is untouched (nothing is emptied), so
  // switching ordering back on shows it again with whatever was in it.
  if (!ORDERING_ENABLED) redirect(ORDERING_PAUSED_REDIRECT);
  const cart = await getCart();
  // Q8: picked here so the client cart receives only the few suggestion cards, never the catalog.
  const suggestions = cartSuggestions([...new Set(cart.lines.map((l) => l.productSlug))]);
  return <CartView cart={cart} suggestions={suggestions} />;
}
