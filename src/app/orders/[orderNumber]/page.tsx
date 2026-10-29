import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { getOrderDetailForViewer } from "@/lib/commerce/orders";
import { OrderStatusView } from "@/components/commerce/OrderStatusView";
import { OrderNotFoundMessage } from "@/components/commerce/OrderNotFoundMessage";
import { canonicalFor, NOINDEX_FOLLOW } from "@/lib/seo";
import { PAYMENT_ACCOUNT, promptpayQrPath, type PaymentAccountView } from "@/data/payment";
import { amountQrAvailable } from "@/lib/commerce/promptpay-qr";
import { lineImage } from "@/lib/commerce/line-image";
import { stockIssueViewFor } from "@/lib/commerce/stock-issues";
import { customerMessagesFor } from "@/lib/commerce/order-messages";
import { isAutoCancelNote, paymentDeadline, sweepIfPastDeadline } from "@/lib/commerce/unpaid-expiry";

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
  let order = await getOrderDetailForViewer(orderNumber, token ?? null);

  if (!order) return <OrderNotFoundMessage />;

  // Owner 24/10 proposal ②: an order past its payment deadline is cancelled before the page shows it (the 15-minute
  // sweep in src/lib/commerce/unpaid-expiry.ts may not have reached it yet) — never "waiting for payment" after the deadline.
  if (sweepIfPastDeadline(order)) order = (await getOrderDetailForViewer(orderNumber, token ?? null)) ?? order;

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

  // Out of stock after payment (cart UX batch E): the swap/refund choice, or where it stands.
  const stockIssue = stockIssueViewFor(order.id);

  // Owner 24/10: the admin's messages to the customer, dated here on the server (one time zone, no hydration drift).
  const dateFmt = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const messages = customerMessagesFor(order.id).map((m) => ({ body: m.body, dateLabel: dateFmt.format(new Date(m.createdAt)) }));
  // Whether money ever came in — a cancelled order that was paid tells the customer about the refund.
  const paid = order.statusHistory.some((h) => h.status === "payment_submitted");
  // Owner 29/10: a slip that was never confirmed (failed or fake) promises no refund — only an order whose money the shop
  // confirmed (it reached "approved") keeps the refund line, e.g. an out-of-stock cancel.
  const paymentConfirmed = order.statusHistory.some((h) => h.status === "approved");
  // Cancelled by the unpaid sweep, not by staff — the page says why. The deadline line shows while it still waits.
  const autoCancelled = order.status === "cancelled" && order.statusHistory.some((h) => h.status === "cancelled" && isAutoCancelNote(h.note));
  const deadlineIso = order.status === "pending_payment" ? paymentDeadline(order.createdAt).toISOString() : null;

  // The history holds staff-only notes (cancel reasons, out-of-stock notes — checker #802) and the page never shows it:
  // it must not reach the browser at all.
  const customerOrder = { ...order, statusHistory: [] };

  return <OrderStatusView order={customerOrder} token={token ?? null} payment={payment} itemImages={itemImages} stockIssue={stockIssue} messages={messages} paid={paid} paymentConfirmed={paymentConfirmed} autoCancelled={autoCancelled} deadlineIso={deadlineIso} />;
}
