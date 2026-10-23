import type { Metadata } from "next";
import { getSession } from "@/lib/commerce/session";
import { listOrdersForCustomer } from "@/lib/commerce/orders";
import { OrderLookupView } from "@/components/commerce/OrderLookupView";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ติดตามคำสั่งซื้อ",
  description: "ติดตามคำสั่งซื้อ — OKami24",
  ...canonicalFor("/orders"),
  ...NOINDEX_FOLLOW,
};

/** "ติดตามคำสั่งซื้อ" (owner 24/10) — works whether online ordering is on or off: a customer may still follow a past order. */
export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return <OrderLookupView phone={null} orders={[]} />;
  const orders = (await listOrdersForCustomer()).map((o) => ({
    orderNumber: o.orderNumber,
    status: o.status,
    total: o.total,
    createdAt: o.createdAt,
  }));
  return <OrderLookupView phone={session.phone} orders={orders} />;
}
