/**
 * The checkout's first address box used to be labelled just "ที่อยู่", so customers typed the WHOLE address there
 * (sub-district, district, province, postcode) and then filled those boxes again. Shipnity joins every Woo address field
 * into one text, so the warehouse saw the address twice (owner 29/10, order C159: "ที่อยู่มันซ้ำไป 2 รอบ").
 *
 * `trimLine1` drops, from the END of line 1 only, the words that repeat the order's own sub-district / district /
 * province / postcode boxes (with or without ตำบล · แขวง · อำเภอ · เขต · จังหวัด and their short forms). It stops at the
 * first word that is not a repeat and never empties the line, so a house number, building or street is never touched.
 * Pure — address-line1-contract-test.ts holds it.
 */
const PREFIX = /^(ตำบล|ต\.|แขวง|อำเภอ|อ\.|เขต|จังหวัด|จ\.)/;
const PREFIX_ONLY = /^(ตำบล|ต\.|แขวง|อำเภอ|อ\.|เขต|จังหวัด|จ\.)$/;

/** A box's value without its ตำบล/อำเภอ/จังหวัด prefix and spaces. */
function core(value: string): string {
  return value.replace(/\s+/g, "").replace(PREFIX, "");
}

export function trimLine1(
  line1: string,
  boxes: { subdistrict: string; district: string; province: string; postalCode: string },
): string {
  const cores = [boxes.subdistrict, boxes.district, boxes.province].map(core).filter((c) => c.length >= 2);
  const postcode = boxes.postalCode.replace(/\s+/g, "");
  const repeats = (word: string): boolean => {
    if (PREFIX_ONLY.test(word)) return true;
    const w = core(word);
    if (!w) return true;
    if (postcode && w === postcode) return true;
    // Equal to a box, or a part of one ("นครสวรรค์" typed where the province box says "นครนครสวรรค์").
    return cores.some((c) => c === w || (w.length >= 3 && c.includes(w)));
  };
  // Words split on spaces and commas; keep the original text up to the last word that stays.
  const words = [...line1.matchAll(/[^\s,]+/g)];
  let keep = words.length;
  while (keep > 1 && repeats(words[keep - 1][0])) keep--;
  if (keep === words.length) return line1.trim();
  const last = words[keep - 1];
  return line1.slice(0, (last.index ?? 0) + last[0].length).trim();
}
