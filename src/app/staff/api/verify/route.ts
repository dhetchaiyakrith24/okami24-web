import crypto from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { PAYMENT_ACCOUNT } from "@/data/payment";
import { isStaff, staffAreaEnabled } from "@/lib/staff/auth";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, getQuota, verifySlipImage } from "@/lib/staff/easyslip";
import { explainReceiver, type ShopAccount, type SlipParty } from "@/lib/staff/receiver-match";
import type { PartyView, QuotaView, SlipCheckResponse } from "@/lib/staff/slip-check-types";
import { sameSiteRequest } from "@/lib/staff/request-guard";
import { findByImageHash, findByTransRef, recordFirstCheck, touchCheck } from "@/lib/staff/slip-checks";

/**
 * POST /staff/api/verify — the staff page uploads ONE slip image here (multipart field `image`, optional
 * `expected` = the order total in baht). Slip-check round 2026-10-07, BSOT §9 "one exception":
 *   1. staff session required (src/lib/staff/auth.ts) — 404 without one, like a page that does not exist;
 *   2. the exact same file checked before AND its receiver was the shop's → answered from our log, EasySlip is
 *      NOT called (any other earlier verdict is asked again — EasySlip answers a slip it already verified from
 *      its cache without using quota, and a fix to our receiver check then applies to it; 08/10);
 *   3. otherwise EasySlip verifies it (key on the server only) and we record transRef / amount / time;
 *   4. the answer says whether the money went to the shop's account and whether this transfer was seen
 *      before. Nothing here changes an order — a person still approves every payment.
 * The image is read into memory, hashed and forwarded; it is never written to disk.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" } as const;

function reply(body: SlipCheckResponse, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: HEADERS });
}

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

function parseExpected(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const n = Number(value.replace(/[,\s฿]/g, ""));
  return Number.isFinite(n) && n > 0 && n < 10_000_000 ? Math.round(n * 100) / 100 : null;
}

function amountCheck(expected: number | null, amountSatang: number) {
  if (expected === null) return null;
  return { expected, matches: Math.round(expected * 100) === amountSatang };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!staffAreaEnabled() || !(await isStaff())) return new NextResponse(null, { status: 404, headers: HEADERS });

  if (!sameSiteRequest(request)) return new NextResponse(null, { status: 403, headers: HEADERS });

  const declared = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_IMAGE_BYTES + 64 * 1024) return reply({ ok: false, error: "IMAGE_SIZE_TOO_LARGE" }, 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, error: "VALIDATION_ERROR" }, 400);
  }
  const image = form.get("image");
  if (!(image instanceof Blob) || image.size === 0) return reply({ ok: false, error: "NO_IMAGE" }, 400);
  if (image.size > MAX_IMAGE_BYTES) return reply({ ok: false, error: "IMAGE_SIZE_TOO_LARGE" }, 413);
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(image.type)) return reply({ ok: false, error: "INVALID_IMAGE_FORMAT" }, 415);
  const expected = parseExpected(form.get("expected"));

  const bytes = Buffer.from(await image.arrayBuffer());
  const imageSha256 = crypto.createHash("sha256").update(bytes).digest("hex");

  // 2. Same file again, receiver already confirmed → our log answers, no EasySlip call, no quota.
  const known = findByImageHash(imageSha256);
  if (known && known.receiverStatus === "match") {
    const previousChecks = known.checkCount;
    touchCheck(known.transRef, null);
    return reply({
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
      quota: await quotaView(false),
    });
  }

  // 3. EasySlip. One retry only when it asks us to wait a moment (429 with a short Retry-After).
  const fileName = image instanceof File && image.name ? image.name.slice(0, 100) : "slip";
  let result = await verifySlipImage(new Blob([bytes], { type: image.type }), fileName);
  if (!result.ok && result.code === "RATE_LIMIT_EXCEEDED" && (result.retryAfterSeconds ?? 99) <= 3) {
    const waitSeconds = result.retryAfterSeconds ?? 1;
    await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
    result = await verifySlipImage(new Blob([bytes], { type: image.type }), fileName);
  }
  if (!result.ok) {
    return reply({ ok: false, error: result.code, retryAfterSeconds: result.retryAfterSeconds }, 200);
  }

  const raw = result.data.rawSlip;
  const amountSatang = Math.round(raw.amount.amount * 100);
  const verdict = explainReceiver(raw.receiver, SHOP);
  let receiverStatus = verdict.status;
  // A match against an account the owner registered in the EasySlip portal also counts — only when that
  // account's digits are the shop's. EasySlip's own matcher outranks ours (10/10: ours turned shop slips red).
  const matched = result.data.matchedAccount?.bankNumber?.replace(/\D/g, "");
  if (receiverStatus !== "match" && matched === SHOP.digits) receiverStatus = "match";
  if (receiverStatus !== "match")
    console.info(
      `[slip-check] receiver ${receiverStatus} — ${verdict.reasons.join(" ")} — shape ${receiverShape(raw.receiver)}`
    );

  const before = findByTransRef(raw.transRef);
  const record = before
    ? touchCheck(raw.transRef, imageSha256, receiverStatus)!
    : recordFirstCheck({ transRef: raw.transRef, amountSatang, transferredAt: raw.date, receiverStatus, imageSha256 });

  return reply({
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
    quota: await quotaView(true),
  });
}
