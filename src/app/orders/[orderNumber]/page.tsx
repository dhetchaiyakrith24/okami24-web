import type { Metadata } from "next";
import { getOrderDetailForViewer } from "@/lib/commerce/orders";
import { OrderStatusView } from "@/components/commerce/OrderStatusView";
import { OrderNotFoundMessage } from "@/components/commerce/OrderNotFoundMessage";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Order status",
  description: "Order status — OKami24.",
  ...canonicalFor("/orders"),
  ...NOINDEX_FOLLOW,
};

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { orderNumber } = await params;
  const { token } = await searchParams;
  const order = await getOrderDetailForViewer(orderNumber, token ?? null);

  if (!order) return <OrderNotFoundMessage />;
  return <OrderStatusView order={order} token={token ?? null} />;
}
