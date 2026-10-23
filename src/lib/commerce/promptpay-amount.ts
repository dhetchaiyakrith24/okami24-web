/**
 * PromptPay QR with the order amount filled in (owner 23/10, BSOT §9: "A ครับทำได้" — the customer scans and the
 * amount is already there, the way game top-up sites do it). Pure, no I/O: promptpay-amount-contract-test.ts runs it.
 *
 * A Thai QR (EMVCo merchant-presented, BOT Thai QR Code standard) is a string of TLV fields — 2-digit tag, 2-digit
 * length, value — ending with tag 63 = CRC-16/CCITT-FALSE over everything before the CRC value. The shop's own QR
 * is "static" (tag 01 = 11, no amount). To make it carry an amount we change only what the standard says changes:
 * tag 01 → 12 ("dynamic": one payment), tag 54 = the amount with 2 decimals, and a fresh CRC. The receiver field
 * (tag 29 / 30) is copied byte for byte, so the slip names the same receiver and the slip check
 * (src/lib/staff/receiver-match.ts, the QR reference) still recognises it.
 */

export interface TlvField {
  id: string;
  value: string;
}

/** Splits a TLV string; null when it does not parse cleanly to the last character. */
export function parseTlv(payload: string): TlvField[] | null {
  const fields: TlvField[] = [];
  let i = 0;
  while (i < payload.length) {
    if (i + 4 > payload.length) return null;
    const id = payload.slice(i, i + 2);
    const len = Number(payload.slice(i + 2, i + 4));
    if (!/^\d{2}$/.test(id) || !/^\d{2}$/.test(payload.slice(i + 2, i + 4)) || i + 4 + len > payload.length) return null;
    fields.push({ id, value: payload.slice(i + 4, i + 4 + len) });
    i += 4 + len;
  }
  return fields;
}

function tlv(id: string, value: string): string {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF), 4 upper-case hex digits — the Thai QR checksum. */
export function crc16(text: string): string {
  let crc = 0xffff;
  for (const byte of Buffer.from(text, "utf8")) {
    crc ^= byte << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** True when the payload is a well-formed PromptPay QR: TLV parses, CRC matches, format 01, THB, a PromptPay
 *  receiver (tag 29 credit transfer or tag 30 bill payment). */
export function isPromptPayPayload(payload: string): boolean {
  const fields = parseTlv(payload);
  if (!fields || fields.length < 2) return false;
  const last = fields[fields.length - 1];
  if (last.id !== "63" || last.value.toUpperCase() !== crc16(payload.slice(0, -4))) return false;
  const get = (id: string) => fields.find((f) => f.id === id)?.value;
  return get("00") === "01" && get("53") === "764" && (get("29") !== undefined || get("30") !== undefined);
}

/** The shop's QR payload with `amountBaht` filled in, or null when the payload is not a valid PromptPay QR or the
 *  amount is not a positive number of baht that fits the field. */
export function withAmount(payload: string, amountBaht: number): string | null {
  if (!isPromptPayPayload(payload)) return null;
  if (!Number.isFinite(amountBaht) || amountBaht <= 0) return null;
  const amount = amountBaht.toFixed(2);
  if (amount.length > 13) return null;
  const kept = parseTlv(payload)!.filter((f) => !["01", "54", "63"].includes(f.id));
  const out: string[] = [];
  for (const f of kept) {
    out.push(tlv(f.id, f.value));
    if (f.id === "00") out.push(tlv("01", "12"));
    if (f.id === "53") out.push(tlv("54", amount));
  }
  const body = `${out.join("")}6304`;
  return body + crc16(body);
}
