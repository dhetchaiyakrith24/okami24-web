/**
 * Paste the admin's LINE order text → the /staff/line-order form filled in for the admin to check (owner 10/11 gap hunt,
 * docs/LINE_ORDERS_GAPS.md "order of work" 2). Pure, so the contract test runs it under plain tsx; the places of a
 * postcode come in as a function (thai-postcodes.ts on the server, a fake in the test).
 *
 * Nothing here decides money: the form still prices from the catalogue and the admin still presses save. What is read:
 * the first mobile number · a 5-digit postcode and its place (one place, or the one whose sub-district the text names) ·
 * ต./อ./จ. words · the line with the house number · a name line · items, matched only when a product's name is in the
 * line (and an option's name, when the product has options). Anything unmatched is handed back as it was written —
 * never guessed into an item.
 */

export interface PastePlace {
  subdistrict: string;
  district: string;
  province: string;
}

export interface PasteProduct {
  slug: string;
  name: string;
  options: { id: string | null; name: string }[];
}

export interface PasteResult {
  customerPhone: string | null;
  recipientName: string | null;
  line1: string | null;
  subdistrict: string | null;
  district: string | null;
  province: string | null;
  postalCode: string | null;
  items: { slug: string; variantId: string | null; quantity: number }[];
  /** Lines that looked like items but matched no product (or an option that is not unique) — shown to the admin. */
  unmatched: string[];
}

const flat = (s: string) => s.toLowerCase().replace(/[\s\-_.]+/g, "");
const PHONE = /(?:\+?66[\s-]?|0)([689])[\s-]?(\d)[\s-]?(\d{3})[\s-]?(\d{4})/;
const POSTCODE = /(?<!\d)(\d{5})(?!\d)/;
const QTY = /(?:[x×*]\s*(\d{1,2})(?!\d)|(\d{1,2})\s*(?:ชิ้น|อัน|กล่อง|ตัว|แท่ง|หัว|ขวด|pcs?)|จำนวน\s*(\d{1,2}))/i;
const PLACE_WORD = { subdistrict: /(?:ตำบล|ต\.|แขวง)\s*([^\s,]+)/, district: /(?:อำเภอ|อ\.|เขต)\s*([^\s,]+)/, province: /(?:จังหวัด|จ\.)\s*([^\s,]+)/ };
const NAME_LABEL = /^(?:ชื่อ(?:ผู้รับ)?|ผู้รับ|คุณ|name)\s*[:：]?\s*/i;
const HOUSE = /(?:\d+\s*\/\s*\d+|\d+\s*(?:หมู่|ม\.|ซอย|ซ\.|ถนน|ถ\.|หมู่บ้าน))|(?:บ้านเลขที่|เลขที่)\s*\d+/;

function phoneOf(text: string): string | null {
  const m = PHONE.exec(text);
  return m ? `0${m[1]}${m[2]}${m[3]}${m[4]}` : null;
}

/** Strip the ต./อ./จ./postcode words off an address line, leaving the house part. */
function housePart(line: string): string {
  return line
    .replace(/(?:ตำบล|ต\.|แขวง|อำเภอ|อ\.|เขต|จังหวัด|จ\.)\s*[^\s,]+/g, " ")
    .replace(POSTCODE, " ")
    .replace(/\s+/g, " ")
    .replace(/[\s,]+$/, "")
    .trim();
}

export function parsePastedOrder(text: string, products: PasteProduct[], placesFor: (postcode: string) => PastePlace[]): PasteResult {
  const lines = text
    .replace(/[​-‍⁠﻿]/g, "")
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const all = lines.join("\n");
  const used = new Set<number>();
  const result: PasteResult = { customerPhone: null, recipientName: null, line1: null, subdistrict: null, district: null, province: null, postalCode: null, items: [], unmatched: [] };

  result.customerPhone = phoneOf(all);
  lines.forEach((l, i) => {
    if (phoneOf(l) && l.replace(PHONE, "").replace(/(?:เบอร์|โทร|tel|phone)\s*[:：]?/i, "").trim().length <= 2) used.add(i);
  });

  // Postcode: a 5-digit number that is not inside the phone.
  const withoutPhone = all.replace(new RegExp(PHONE.source, "g"), " ");
  const postal = POSTCODE.exec(withoutPhone)?.[1] ?? null;
  result.postalCode = postal;
  const typed = {
    subdistrict: PLACE_WORD.subdistrict.exec(all)?.[1] ?? null,
    district: PLACE_WORD.district.exec(all)?.[1] ?? null,
    province: PLACE_WORD.province.exec(all)?.[1] ?? null,
  };
  const places = postal ? placesFor(postal) : [];
  const named = places.filter((p) => all.includes(p.subdistrict));
  const place = places.length === 1 ? places[0] : named.length === 1 ? named[0] : null;
  result.subdistrict = place?.subdistrict ?? typed.subdistrict;
  result.district = place?.district ?? (places.length > 0 && places.every((p) => p.district === places[0].district) ? places[0].district : typed.district);
  result.province = place?.province ?? (places[0]?.province ?? typed.province);

  // The house line: the first line with a house number shape that is not the phone line.
  const houseIdx = lines.findIndex((l, i) => !used.has(i) && HOUSE.test(l.replace(PHONE, "")));
  if (houseIdx >= 0) {
    result.line1 = housePart(lines[houseIdx].replace(/^(?:ที่อยู่|address)\s*[:：]?\s*/i, "")) || null;
    used.add(houseIdx);
  }
  // Lines that only carry place words or the postcode belong to the address too.
  lines.forEach((l, i) => {
    if (!used.has(i) && housePart(l).length === 0) used.add(i);
  });

  // Items: a line naming a product (and one option of it, when it has options).
  const sorted = [...products].sort((a, b) => b.name.length - a.name.length);
  lines.forEach((l, i) => {
    if (used.has(i)) return;
    const f = flat(l);
    const product = sorted.find((p) => f.includes(flat(p.name)));
    if (!product) return;
    used.add(i);
    const q = QTY.exec(l);
    const quantity = Math.max(1, Math.min(50, Number(q?.[1] ?? q?.[2] ?? q?.[3] ?? 1)));
    const rest = flat(l).replace(flat(product.name), "");
    const options = product.options.filter((o) => o.id === null || rest.includes(flat(o.name)));
    if (product.options.length === 1 && product.options[0].id === null) {
      result.items.push({ slug: product.slug, variantId: null, quantity });
    } else if (options.length === 1 && options[0].id !== null) {
      result.items.push({ slug: product.slug, variantId: options[0].id, quantity });
    } else {
      result.unmatched.push(l);
    }
  });

  // The name: a labelled line, else the first short line left that has no digit.
  const labelled = lines.findIndex((l, i) => !used.has(i) && NAME_LABEL.test(l));
  const nameIdx = labelled >= 0 ? labelled : lines.findIndex((l, i) => !used.has(i) && !/\d/.test(l) && l.length <= 60);
  if (nameIdx >= 0) {
    result.recipientName = lines[nameIdx].replace(NAME_LABEL, "").trim() || null;
    used.add(nameIdx);
  }
  // Whatever is left with a quantity shape looked like an item the catalogue does not know.
  lines.forEach((l, i) => {
    if (!used.has(i) && QTY.test(l)) result.unmatched.push(l);
  });
  return result;
}
