import "server-only";

/**
 * Receiving account for bank transfer / PromptPay — owner decision 2026-09-06
 * (docs/BUSINESS_SOURCE_OF_TRUTH.md §9).
 *
 * Visibility rule (owner): the account number and the QR are shown ONLY on the order status page
 * of a placed order that is still awaiting payment. That is why this module is `server-only` and
 * NOT part of the i18n dictionaries (those ship to the browser on every page): the order page's
 * server component reads it and passes the values down as props; the QR image lives outside
 * `public/` and is served by a route handler that re-checks the viewer's right to see the order.
 *
 * Facts: account number typed by the owner (`153-8-292407`, same digits in KBank grouping);
 * bank and account name read from the owner's PromptPay QR image (K+ branding).
 */
export const PAYMENT_ACCOUNT = {
  bankName: { th: "ธนาคารกสิกรไทย", en: "Kasikornbank (KBank)", zh: "开泰银行 (KBank)" },
  accountName: "นาย จีระศักดิ์ เกษมสวัสดิ์",
  accountNumber: "153-8-29240-7",
} as const;

/** The PromptPay QR file — kept in the gitignored private data folder, never under `public/`.
 *  Locally that is `.data/private/promptpay-qr.png`; on a host it follows `OKAMI24_DATA_DIR` onto
 *  the mounted disk (src/lib/paths.ts), which is why this is resolved through a function instead
 *  of a fixed relative string.
 *  NOT covered by the automatic backup (that copies the SQLite file only); the owner holds the
 *  original image, and docs/BACKUP.md + docs/DEPLOY-RENDER.md say how to put it on the disk.
 *  Missing file = the order page simply shows the account number without a QR. */
export { promptpayQrPath } from "@/lib/paths";

export type PaymentAccountView = {
  /** all three locales — the client view picks the active one (the page has no server locale helper) */
  bankName: { th: string; en: string; zh: string };
  accountName: string;
  accountNumber: string;
  /** true when the QR file exists on this server, so the client can render the <img> */
  hasQr: boolean;
};
