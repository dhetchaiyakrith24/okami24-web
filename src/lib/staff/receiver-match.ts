/**
 * Does the slip's receiver look like the shop's account? (slip-check round 2026-10-07)
 *
 * A bank slip never shows the full receiver account: EasySlip returns it MASKED, e.g. `xxx-x-x9240-x`
 * (document.easyslip.com /en/v2/verify/bank/ — `receiver.account.bank.account`), and slips often cut the
 * surname short. So the check is "nothing contradicts the shop's account, and at least one real piece
 * of it is confirmed":
 *   - bank must be KBank (id 004 / short KBANK) — the shop's only account (BSOT §9);
 *   - every digit the slip DOES show must equal the shop's digit at the same position;
 *   - the Thai name, when the slip carries one, must contain the shop owner's first name;
 *   - a slip paid by scanning the shop's own K+ QR names the receiver by that QR's 15-digit PromptPay
 *     reference (`account.proxy`, type EWALLETID — "เติมเงินพร้อมเพย์" on the slip) instead of the account
 *     number: its visible digits in place confirm the shop the same way (real case 2026-10-08, which came
 *     back "unclear" because the reference was unknown here and the slip carried no bank).
 * "unclear" = nothing contradicts but nothing is confirmed either (e.g. a PromptPay slip that shows only
 * a masked phone number and no name) — the staff member checks the bank app by hand.
 *
 * Pure: no I/O, so slip-check-contract-test.ts can run it against the documented response shapes.
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

function compact(text: string): string {
  return text.replace(/\s+/g, "");
}

/** Positional digit check on a masked account. Returns null when the slip shows no usable digits. */
function digitsAgree(masked: string, shopDigits: string): { agree: boolean; shown: number } | null {
  const chars = masked.replace(/[-\s]/g, "");
  if (chars.length !== shopDigits.length) return null;
  let shown = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (!/[0-9]/.test(c)) continue;
    shown++;
    if (c !== shopDigits[i]) return { agree: false, shown };
  }
  return shown === 0 ? null : { agree: true, shown };
}

export function matchReceiver(receiver: SlipParty | undefined, shop: ShopAccount): ReceiverStatus {
  if (!receiver) return "unclear";

  const bankId = receiver.bank?.id?.trim();
  const bankShort = receiver.bank?.short?.trim().toUpperCase();
  const bankKnown = Boolean(bankId || bankShort);
  const bankIsShop = bankId === shop.bankId || bankShort === shop.bankShort;
  if (bankKnown && !bankIsShop) return "mismatch";

  let confirmed = 0;

  // Paid through the shop's QR: the receiver is the QR's PromptPay reference. A same-length reference whose
  // visible digits differ is someone else's QR; another length (a phone, an ID card) is simply not compared.
  let viaShopQr = false;
  const proxy = receiver.account?.proxy?.account;
  if (proxy && shop.promptPayRef) {
    const d = digitsAgree(proxy, shop.promptPayRef);
    if (d && !d.agree) return "mismatch";
    if (d && d.shown >= 3) {
      viaShopQr = true;
      confirmed++;
    }
  }

  const masked = receiver.account?.bank?.account;
  if (masked) {
    const d = digitsAgree(masked, shop.digits);
    if (d && !d.agree) return "mismatch";
    // Three or more matching visible digits is a real confirmation; one or two could be chance.
    if (d && d.shown >= 3) confirmed++;
  }

  const nameTh = receiver.account?.name?.th;
  if (nameTh && nameTh.trim()) {
    const given = compact(nameTh.trim().replace(TITLES, ""));
    const first = compact(shop.firstNameTh);
    // Slips truncate long names ("นาย จีระศักดิ์ เ"); the first name is the part that is always whole.
    // A slip that cut even the first name short still has to agree with its beginning.
    const agrees = given.startsWith(first) || (given.length >= 4 && first.startsWith(given));
    if (!agrees) return "mismatch";
    if (given.startsWith(first)) confirmed++;
  }

  return (bankIsShop || viaShopQr) && confirmed > 0 ? "match" : "unclear";
}
