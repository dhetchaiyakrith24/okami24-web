import data from "@/data/thai-address/postcodes.json";

/**
 * Thai postcodes → the places they serve (owner queue 02/11 item 4: the postcode goes first and the customer picks the
 * sub-district / district / province it covers, instead of typing them). Data = src/data/thai-address/postcodes.json,
 * built by scripts/build-thai-postcodes.js from kongvut/thai-province-data (MIT). Server side only: the file is ~600 KB,
 * so browsers ask /api/address/postcode/<code> for one code instead of downloading it.
 *
 * One postcode often covers several sub-districts, sometimes in two provinces (83000 = Phuket town and Ko Yao, Phang Nga),
 * so the customer always picks — nothing is guessed. A code the data does not list is refused (owner 02/11 "รหัสไม่มีจริง =
 * ไปต่อไม่ได้"; checker 02/11: a prefix-only manual path let made-up codes such as 10999 through) — the field tells the
 * customer to check it again or message the shop on LINE. Licence of the data: LICENSE-thai-province-data.txt beside it.
 */

export interface Place {
  subdistrict: string;
  district: string;
  province: string;
}

const CODES = (data as unknown as { codes: Record<string, [string, string, string][]> }).codes;

// Invisible characters out (checker #1169: "คลองเตย" + U+200B passed as a hand-typed place and so as a second address for
// the once-a-month free-shipping check), runs of spaces to one, and a hand-typed name capped at 80 characters.
const clean = (s: string) => s.replace(/[\u200B-\u200D\u2060\uFEFF]/g, "").replace(/\s+/g, " ").trim().slice(0, 80);

/** The places a 5-digit postcode serves; empty when the code is malformed or not in the data. */
export function placesForPostcode(code: string): Place[] {
  const rows = /^[0-9]{5}$/.test(code.trim()) ? CODES[code.trim()] : undefined;
  return (rows ?? []).map(([subdistrict, district, province]) => ({ subdistrict, district, province }));
}

// "ต. คลองเตย" / "แขวงคลองเตย" / "จ.เชียงใหม่" → the bare name the data holds, so a place typed by hand still matches it.
const PREFIX = /^(ตำบล|แขวง|ต\.|อำเภอ|เขต|อ\.|จังหวัด|จ\.)\s*/;
const bare = (s: string) => clean(s).replace(PREFIX, "");
const sameName = (typed: string, name: string) => bare(typed) === name || (name === "กรุงเทพมหานคร" && /^(กรุงเทพ|กทม\.?)$/.test(bare(typed)));

/**
 * What the server accepts for an address, and the place it stores (owner 03/11: the customer may type the sub-district,
 * district and province by hand instead of picking them):
 *   "place"  = the code serves this sub-district + district + province (prefixes such as "ต." / "แขวง" allowed);
 *   "manual" = the code is real and the province is one it serves, but the sub-district or district is not in the data
 *              (a spelling of their own, or a place the data lacks) — kept as typed;
 *   "wrong"  = a malformed code, a code the data does not list (owner 02/11 "รหัสไม่มีจริง = ไปต่อไม่ได้"), or a province the
 *              code does not serve.
 * `place` = what to store: the data's own spelling wherever a name matches it, so the once-a-month free-shipping check
 * (shipping-rules.ts, keyed on sub-district + postcode) sees one address, not two spellings of it.
 */
export function checkPostcodePlace(code: string, place: Place): { kind: "place" | "manual"; place: Place } | { kind: "wrong" } {
  const c = code.trim();
  const rows = /^[0-9]{5}$/.test(c) ? CODES[c] : undefined;
  if (!rows) return { kind: "wrong" };
  const exact = rows.find(([s, d, pr]) => sameName(place.subdistrict, s) && sameName(place.district, d) && sameName(place.province, pr));
  if (exact) return { kind: "place", place: { subdistrict: exact[0], district: exact[1], province: exact[2] } };
  const inProvince = rows.filter(([, , pr]) => sameName(place.province, pr));
  if (inProvince.length === 0) return { kind: "wrong" };
  const district = inProvince.find(([, d]) => sameName(place.district, d))?.[1];
  const subdistrict = inProvince.find(([s]) => sameName(place.subdistrict, s))?.[0];
  return {
    kind: "manual",
    place: { subdistrict: subdistrict ?? clean(place.subdistrict), district: district ?? clean(place.district), province: inProvince[0][2] },
  };
}

/** Is this sub-district one the postcode really serves (prefixes allowed)? The free-shipping check asks it: a hand-typed
 *  sub-district the data does not know must not make an address look new (shipping-rules.ts `benefitUsed`). */
export function isPostcodeSubdistrict(code: string, subdistrict: string): boolean {
  const rows = CODES[code.trim()];
  return !!rows && rows.some(([s]) => sameName(subdistrict, s));
}

export interface PlaceHit extends Place {
  postalCode: string;
}

const ALL: (PlaceHit & { text: string })[] = Object.entries(CODES).flatMap(([postalCode, rows]) =>
  rows.map(([subdistrict, district, province]) => ({ postalCode, subdistrict, district, province, text: `${subdistrict} ${district} ${province} ${postalCode}` }))
);

/**
 * Places that match what the customer typed in the address search (owner 03/11 "มีช่องไว้สำหรับพิมพ์ค้นหา"): every word of the
 * query must appear in "sub-district district province postcode"; sub-districts whose name starts with the first word come
 * first. Fewer than 2 characters = nothing (every row would match).
 */
export function searchPlaces(query: string, limit = 8): PlaceHit[] {
  const words = clean(query).split(" ").map(bare).filter(Boolean);
  if (words.join("").length < 2) return [];
  const hits = ALL.filter((r) => words.every((w) => r.text.includes(w)));
  const head = words[0];
  hits.sort((a, b) => Number(!a.subdistrict.startsWith(head)) - Number(!b.subdistrict.startsWith(head)));
  return hits.slice(0, limit).map(({ postalCode, subdistrict, district, province }) => ({ postalCode, subdistrict, district, province }));
}
