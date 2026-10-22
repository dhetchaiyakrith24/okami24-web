import "server-only";
import crypto from "node:crypto";
import { PAYMENT_ACCOUNT } from "@/data/payment";
import { getQuota, verifySlipImage } from "@/lib/staff/easyslip";
import { explainReceiver, type ShopAccount, type SlipParty } from "@/lib/staff/receiver-match";
import type { PartyView, QuotaView, SlipCheckResponse } from "@/lib/staff/slip-check-types";
import { findByImageHash, findByTransRef, recordFirstCheck, touchCheck } from "@/lib/staff/slip-checks";

/**
 * One slip check, shared by every place a slip arrives (cart round 22/10): the staff page (/staff/api/verify),
 * the customer's order page (/orders/<n>/slip) and the "OKM Slip" LINE group (src/lib/line/webhook.ts).
 * Moved here unchanged from the staff route (slip-check round 2026-10-07):
 *   1. the exact same file checked before AND its receiver was the shop's → answered from our log, EasySlip is
 *      NOT called (any other earlier verdict is asked again — EasySlip answers a slip it already verified from
 *      its cache without using quota, and a fix to our receiver check then applies to it; 08/10);
 *   2. otherwise EasySlip verifies it (key on the server only) and we record transRef / amount / time.
 * The caller does access control and size/type checks; the image stays in memory and is never written to disk.
 */

const SHOP: ShopAccount = {
  bankId: "004",
  bankShort: "KBANK",
  digits: PAYMENT_ACCOUNT.accountNumber.replace(/\D/g, ""),
  firstNameTh: PAYMENT_ACCOUNT.accountName.replace(/^(นาย|นางสาว|นาง)\s*/, "").split(/\s+/)[0],
  promptPayRef: PAYMENT_ACCOUNT.promptPayRef.replace(/\D/g, ""),
};

/** Shown for a slip answered from our log (verdict "match" only): the receiver is the shop's own account. */
const SHOP_VIEW: PartyView = { name: PAYMENT_ACCOUNT.accountName, bank: PAYMENT_ACCOUNT.bankName.th, account: "บัญชีของร้าน" };

/** What the slip's receiver block looked like, with every digit and letter of a value hidden — so any verdict
 *  other than "match" can be explained from the server log, without logging anyone's name or number (the
 *  receiver may be a third party). */
function receiverShape(p: SlipParty | undefined): string {
  if (!p) return "no receiver";
  const hide = (v?: string) => (v ? v.replace(/[0-9]/g, "9").replace(/[^9\-\s]/g, "x") : "-");
  return JSON.stringify({
    bank: p.bank ? { id: p.bank.id ?? null, short: p.bank.short ?? null } : null,
    nameTh: Boolean(p.account?.name?.th?.trim()),
    nameEn: Boolean(p.account?.name?.en?.trim()),
    bankAccount: p.account?.bank ? { type: p.account.bank.type ?? null, shape: hide(p.account.bank.account) } : null,
    proxy: p.account?.proxy ? { type: p.account.proxy.type ?? null, shape: hide(p.account.proxy.account) } : null,
  });
}

function partyView(p: SlipParty | undefined): PartyView | null {
  if (!p) return null;
  const name = p.account?.name?.th?.trim() || p.account?.name?.en?.trim() || null;
  // A slip paid through a PromptPay QR may carry no bank at all, only the QR's reference (08/10).
  const bank = p.bank?.name?.trim() || p.bank?.short?.trim() || (p.account?.proxy?.account ? "พร้อมเพย์" : null);
  const account = p.account?.bank?.account?.trim() || p.account?.proxy?.account?.trim() || null;
  return { name, bank, account };
}

async function quotaView(fresh: boolean): Promise<QuotaView | null> {
  const q = await getQuota(fresh);
  return q.ok ? q.data : null;
}

function amountCheck(expected: number | null, amountSatang: number) {
  if (expected === null) return null;
  return { expected, matches: Math.round(expected * 100) === amountSatang };
}

export async function checkSlip(input: {
  bytes: Buffer;
  type: string;
  fileName: string;
  /** The order total in baht, or null when there is no order to compare with. */
  expected: number | null;
  /** The staff page shows EasySlip's quota; the other callers skip that extra call. */
  withQuota: boolean;
}): Promise<SlipCheckResponse> {
  const { bytes, type, fileName, expected, withQuota } = input;
  const imageSha256 = crypto.createHash("sha256").update(bytes).digest("hex");

  // 1. Same file again, receiver already confirmed → our log answers, no EasySlip call, no quota.
  const known = findByImageHash(imageSha256);
  if (known && known.receiverStatus === "match") {
    const previousChecks = known.checkCount;
    touchCheck(known.transRef, null);
    return {
      ok: true,
      source: "image-cache",
      slip: {
        transRef: known.transRef,
        amount: known.amountSatang / 100,
        transferredAt: known.transferredAt,
        receiverStatus: known.receiverStatus,
        receiver: SHOP_VIEW,
        sender: null,
      },
      duplicate: { by: "log", firstCheckedAt: known.firstCheckedAt, previousChecks },
      amountCheck: amountCheck(expected, known.amountSatang),
      quota: withQuota ? await quotaView(false) : null,
    };
  }

  // 2. EasySlip. One retry only when it asks us to wait a moment (429 with a short Retry-After).
  let result = await verifySlipImage(new Blob([new Uint8Array(bytes)], { type }), fileName);
  if (!result.ok && result.code === "RATE_LIMIT_EXCEEDED" && (result.retryAfterSeconds ?? 99) <= 3) {
    const waitSeconds = result.retryAfterSeconds ?? 1;
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    result = await verifySlipImage(new Blob([new Uint8Array(bytes)], { type }), fileName);
  }
  if (!result.ok) return { ok: false, error: result.code, retryAfterSeconds: result.retryAfterSeconds };

  const raw = result.data.rawSlip;
  const amountSatang = Math.round(raw.amount.amount * 100);
  const verdict = explainReceiver(raw.receiver, SHOP);
  let receiverStatus = verdict.status;
  // A match against an account the owner registered in the EasySlip portal also counts — only when that
  // account's digits are the shop's. EasySlip's own matcher outranks ours (10/10: ours turned shop slips red).
  const matched = result.data.matchedAccount?.bankNumber?.replace(/\D/g, "");
  if (receiverStatus !== "match" && matched === SHOP.digits) receiverStatus = "match";
  if (receiverStatus !== "match")
    console.info(`[slip-check] receiver ${receiverStatus} — ${verdict.reasons.join(" ")} — shape ${receiverShape(raw.receiver)}`);

  const before = findByTransRef(raw.transRef);
  const record = before
    ? touchCheck(raw.transRef, imageSha256, receiverStatus)!
    : recordFirstCheck({ transRef: raw.transRef, amountSatang, transferredAt: raw.date, receiverStatus, imageSha256 });

  return {
    ok: true,
    source: "api",
    slip: {
      transRef: raw.transRef,
      amount: amountSatang / 100,
      transferredAt: raw.date,
      receiverStatus,
      receiver: partyView(raw.receiver),
      sender: partyView(raw.sender),
    },
    duplicate: before
      ? { by: "log", firstCheckedAt: before.firstCheckedAt, previousChecks: before.checkCount }
      : result.data.isDuplicate
        ? { by: "easyslip" }
        : null,
    amountCheck: amountCheck(expected, record.amountSatang),
    quota: withQuota ? await quotaView(true) : null,
  };
}
