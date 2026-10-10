/**
 * Does the slip's receiver look like the shop's account? (slip-check round 2026-10-07 · reworked 2026-10-10)
 *
 * A bank slip never shows the full receiver account: EasySlip returns it MASKED, e.g. `xxx-x-x9240-x`
 * (document.easyslip.com /en/v2/verify/bank/ — `receiver.account.bank.account`). Evidence, strongest first:
 *   - the visible digits of the account number, in place, against the shop's (≥3 shown = confirmed);
 *   - a slip paid by scanning the shop's own K+ QR names the receiver by that QR's 15-digit PromptPay reference
 *     (`account.proxy`, type EWALLETID — "เติมเงินพร้อมเพย์" on the slip; real case 2026-10-08) — same rule;
 *   - the bank (must be KBank — the shop's only account, BSOT §9);
 *   - the Thai name (weakest: banks print it differently — truncated, or in English on Krungsri slips).
 * "mismatch" (red) only on HARD evidence of another account: another bank, or visible account / QR digits that
 * differ, with nothing of the shop's confirmed. A name never turns anything red, and a name with no Thai letters
 * is not compared at all — 10/10 Krungsri slips that went to the shop's account came back red, most likely on the
 * name [เชื่อว่า].
 * "unclear" = not confirmed and not contradicted, or the evidence disagrees — the staff member checks by hand.
 *
 * Pure: no I/O, so slip-check-contract-test.ts can run it against the documented response shapes. `reasons` say
 * which rule decided (no names or digits in them) and go to the server log for any verdict other than "match".
 */

export type ReceiverStatus = "match" | "mismatch" | "unclear";

export interface SlipParty {
  bank?: { id?: string; name?: string; short?: string };
  account?: {
    name?: { th?: string; en?: string };
    bank?: { type?: string; account?: string };
    proxy?: { type?: string; account?: string };
  };
}

export interface ShopAccount {
  bankId: string;
  bankShort: string;
  /** digits only, e.g. "1538292407" */
  digits: string;
  /** the account holder's Thai first name as printed on slips, without title */
  firstNameTh: string;
  /** digits only — the PromptPay reference of the shop's own QR (src/data/payment.ts `promptPayRef`) */
  promptPayRef?: string;
}

const TITLES = /^(นาย|นางสาว|นาง|น\.ส\.|ด\.ช\.|ด\.ญ\.|บจก\.|บริษัท)\s*/;
const THAI = /[ก-๛]/;

function compact(text: string): string {
  return text.replace(/\s+/g, "");
}

type Digits = "confirmed" | "differs" | "too-few" | "not-comparable" | "absent";

/** Positional digit check on a masked number against the shop's. */
function compareDigits(masked: string | undefined, shopDigits: string | undefined): Digits {
  if (!masked || !masked.trim()) return "absent";
  if (!shopDigits) return "not-comparable";
  const chars = masked.replace(/[-\s]/g, "");
  if (chars.length !== shopDigits.length) return "not-comparable";
  let shown = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (!/[0-9]/.test(c)) continue;
    shown++;
    if (c !== shopDigits[i]) return "differs";
  }
  // Three or more matching visible digits is a real confirmation; one or two could be chance.
  return shown >= 3 ? "confirmed" : "too-few";
}

export interface ReceiverVerdict {
  status: ReceiverStatus;
  reasons: string[];
}

export function explainReceiver(receiver: SlipParty | undefined, shop: ShopAccount): ReceiverVerdict {
  if (!receiver) return { status: "unclear", reasons: ["no-receiver"] };

  const bankId = receiver.bank?.id?.trim();
  const bankShort = receiver.bank?.short?.trim().toUpperCase();
  const bank = !bankId && !bankShort ? "absent" : bankId === shop.bankId || bankShort === shop.bankShort ? "shop" : "other";

  const account = compareDigits(receiver.account?.bank?.account, shop.digits);
  const qr = compareDigits(receiver.account?.proxy?.account, shop.promptPayRef);

  let name: "fits" | "differs" | "not-thai" | "absent" = "absent";
  const nameTh = receiver.account?.name?.th?.trim();
  if (nameTh) {
    if (!THAI.test(nameTh)) name = "not-thai";
    else {
      const given = compact(nameTh.replace(TITLES, ""));
      const first = compact(shop.firstNameTh);
      // Slips truncate long names ("นาย จีระศักดิ์ เ"); the first name is the part that is always whole.
      name = given.startsWith(first) || (given.length >= 4 && first.startsWith(given)) ? "fits" : "differs";
    }
  }

  const reasons = [`bank:${bank}`, `account:${account}`, `qr:${qr}`, `name:${name}`];
  const shopConfirmed = account === "confirmed" || qr === "confirmed";
  const otherAccount = account === "differs" || qr === "differs";

  if (shopConfirmed) {
    // The shop's digits in place decide — unless the same slip ALSO shows another account, another bank, or a
    // clearly different Thai name (a masked number shows as few as 4 digits): then a person looks, never red.
    if (otherAccount || bank === "other" || name === "differs")
      return { status: "unclear", reasons: [...reasons, "evidence-disagrees"] };
    return { status: "match", reasons };
  }
  if (otherAccount || bank === "other") return { status: "mismatch", reasons };
  // No digits to go on: the shop's bank plus the owner's Thai first name is enough; a different Thai name is not
  // proof of another account (banks print names differently), so it stays for a person to check.
  if (bank === "shop" && name === "fits") return { status: "match", reasons };
  return { status: "unclear", reasons };
}

export function matchReceiver(receiver: SlipParty | undefined, shop: ShopAccount): ReceiverStatus {
  return explainReceiver(receiver, shop).status;
}
