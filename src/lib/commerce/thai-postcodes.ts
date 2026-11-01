import data from "@/data/thai-address/postcodes.json";

/**
 * Thai postcodes → the places they serve (owner queue 02/11 item 4: the postcode goes first and the customer picks the
 * sub-district / district / province it covers, instead of typing them). Data = src/data/thai-address/postcodes.json,
 * built by scripts/build-thai-postcodes.js from kongvut/thai-province-data (MIT). Server side only: the file is ~600 KB,
 * so browsers ask /api/address/postcode/<code> for one code instead of downloading it.
 *
 * One postcode often covers several sub-districts, sometimes in two provinces (83000 = Phuket town and Ko Yao, Phang Nga),
 * so the customer always picks — nothing is guessed. A few real codes are missing from the data (building codes such as
 * 10501): those go through the manual path, checked only against the provinces the code's first two digits belong to.
 */

export interface Place {
  subdistrict: string;
  district: string;
  province: string;
}

const CODES = (data as unknown as { codes: Record<string, [string, string, string][]> }).codes;

/** Provinces per postcode prefix (first two digits), for codes the data does not list. */
const PREFIX_PROVINCES = new Map<string, Set<string>>();
for (const [code, rows] of Object.entries(CODES)) {
  const set = PREFIX_PROVINCES.get(code.slice(0, 2)) ?? new Set<string>();
  for (const r of rows) set.add(r[2]);
  PREFIX_PROVINCES.set(code.slice(0, 2), set);
}

const clean = (s: string) => s.trim().replace(/\s+/g, " ");

/** The places a 5-digit postcode serves; empty when the code is malformed or not in the data. */
export function placesForPostcode(code: string): Place[] {
  const rows = /^[0-9]{5}$/.test(code.trim()) ? CODES[code.trim()] : undefined;
  return (rows ?? []).map(([subdistrict, district, province]) => ({ subdistrict, district, province }));
}

/** What the server accepts for an address: "place" = the exact sub-district + district + province the postcode serves;
 *  "manual" = a code the data does not list, whose province matches the code's first two digits; anything else = "wrong". */
export function checkPostcodePlace(code: string, place: Place): "place" | "manual" | "wrong" {
  const c = code.trim();
  if (!/^[0-9]{5}$/.test(c)) return "wrong";
  const rows = CODES[c];
  if (rows) {
    const p = { subdistrict: clean(place.subdistrict), district: clean(place.district), province: clean(place.province) };
    return rows.some(([s, d, pr]) => s === p.subdistrict && d === p.district && pr === p.province) ? "place" : "wrong";
  }
  return PREFIX_PROVINCES.get(c.slice(0, 2))?.has(clean(place.province)) ? "manual" : "wrong";
}
