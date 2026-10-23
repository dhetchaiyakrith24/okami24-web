import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { getOrderDetailForViewer } from "@/lib/commerce/orders";
import { OrderStatusView } from "@/components/commerce/OrderStatusView";
import { OrderNotFoundMessage } from "@/components/commerce/OrderNotFoundMessage";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { PAYMENT_ACCOUNT, promptpayQrPath, type PaymentAccountView } from "@/data/payment";
import { amountQrAvailable } from "@/lib/commerce/promptpay-qr";
import { lineImage } from "@/lib/commerce/line-image";

export const metadata: Metadata = {
  title: "สถานะคำสั่งซื้อ",
  description: "สถานะคำสั่งซื้อ — OKami24",
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

  // Bank details only for an order that is still waiting for payment (owner rule 2026-09-06,
  // BSOT §9) — resolved here on the server, never shipped in the client dictionary.
  let payment: PaymentAccountView | null = null;
  if (order.status === "pending_payment") {
    payment = {
      bankName: PAYMENT_ACCOUNT.bankName,
      accountName: PAYMENT_ACCOUNT.accountName,
      accountNumber: PAYMENT_ACCOUNT.accountNumber,
      hasQr: existsSync(promptpayQrPath()),
      // Owner 23/10: the QR carries the order total when the shop QR decodes (src/lib/commerce/promptpay-qr.ts).
      qrHasAmount: await amountQrAvailable(),
    };
  }

  const itemImages = order.items.map((item) => lineImage(item.productSlug, item.variantId));

  return <OrderStatusView order={order} token={token ?? null} payment={payment} itemImages={itemImages} />;
}
