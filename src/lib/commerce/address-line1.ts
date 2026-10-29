/**
 * The checkout's first address box used to be labelled just "ที่อยู่", so customers typed the WHOLE address there
 * (sub-district, district, province, postcode) and then filled those boxes again. Shipnity joins every Woo address field
 * into one text, so the warehouse saw the address twice (owner 29/10, order C159: "ที่อยู่มันซ้ำไป 2 รอบ").
 *
 * `trimLine1` drops, from the END of line 1 only, a run of words that repeats the order's own sub-district / district /
 * province / postcode boxes — and only when that run is ANCHORED: it holds the postcode or a word written with
 * ตำบล · แขวง · อำเภอ · เขต · จังหวัด (or ต. อ. จ.). A bare place name with no anchor ("123 ถนน ลาดพร้าว") is never cut,
 * nor a name right after a place word (ถนน · ซอย · หมู่บ้าน · ตลาด …), so a real street or building is never touched
 * (checker #1010). It never empties the line. Pure — address-line1-contract-test.ts holds it.
 * Owner 30/10 ("ตรวจเรื่องที่อยู่ซ้ำ"): Bangkok written short (กทม. · กรุงเทพฯ) counts as the province box, a trailing
 * country word (ประเทศไทย · Thailand) is part of the repeat, and a postcode glued to the word before it ("ภูเก็ต83150")
 * still anchors — before, each of these stopped the cut and left the repeat in.
 */
const PREFIX = /^(ตำบล|ต\.|แขวง|อำเภอ|อ\.|เขต|จังหวัด|จ\.)/;
const PREFIX_ONLY = /^(ตำบล|ต\.|แขวง|อำเภอ|อ\.|เขต|จังหวัด|จ\.)$/;
/** Words that name what comes next — the name after one of them belongs to the street/building, not to a box. */
const PLACE_WORD = /^(ถนน|ถ\.|ซอย|ซ\.|หมู่บ้าน|หมู่|ม\.|ตลาด|คอนโด|อาคาร|หอพัก|วัด|ชุมชน|นิคม|โครงการ)$/;
/** Bangkok as customers write it — the same as a province box that says กรุงเทพมหานคร. */
const BANGKOK = /^(กรุงเทพมหานคร|กรุงเทพฯ?|กทม\.?)$/;
/** The country at the very end of an address — never a street or building name there. */
const COUNTRY = /^(ประเทศไทย|thailand)$/i;

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
  // Equal to a box, or a part of one of 4+ letters ("นครสวรรค์" typed where the province box says "นครนครสวรรค์").
  const bangkok = BANGKOK.test(core(boxes.province));
  const matchesBox = (w: string) => cores.some((c) => c === w || (w.length >= 4 && c.includes(w))) || (bangkok && BANGKOK.test(w));
  /** "anchor" = the postcode or a prefixed word; "plain" = an unprefixed repeat; null = not a repeat. */
  const kind = (word: string): "anchor" | "plain" | null => {
    if (PREFIX_ONLY.test(word)) return "anchor";
    if (postcode && word === postcode) return "anchor";
    // "ภูเก็ต83150": the postcode glued to a repeated name.
    if (postcode && word.length > postcode.length && word.endsWith(postcode) && kind(word.slice(0, -postcode.length))) return "anchor";
    if (COUNTRY.test(word)) return "plain";
    const w = core(word);
    if (!w) return null;
    if (PREFIX.test(word)) return matchesBox(w) ? "anchor" : null;
    return matchesBox(w) ? "plain" : null;
  };

  const words = [...line1.matchAll(/[^\s,]+/g)];
  let start = words.length;
  let anchored = false;
  while (start > 1) {
    const k = kind(words[start - 1][0]);
    if (!k) break;
    // A plain name right after a place word is the street/building's own name — the run stops before it.
    if (k === "plain" && PLACE_WORD.test(words[start - 2][0])) break;
    if (k === "anchor") anchored = true;
    start--;
  }
  if (!anchored || start === words.length) return line1.trim();
  const last = words[start - 1];
  return line1.slice(0, (last.index ?? 0) + last[0].length).trim();
}
