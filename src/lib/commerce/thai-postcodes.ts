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

const clean = (s: string) => s.trim().replace(/\s+/g, " ");

/** The places a 5-digit postcode serves; empty when the code is malformed or not in the data. */
export function placesForPostcode(code: string): Place[] {
  const rows = /^[0-9]{5}$/.test(code.trim()) ? CODES[code.trim()] : undefined;
  return (rows ?? []).map(([subdistrict, district, province]) => ({ subdistrict, district, province }));
}

/** What the server accepts for an address: "place" = the exact sub-district + district + province the postcode serves;
 *  anything else (a malformed code, a code the data does not list, a place the code does not serve) = "wrong". */
export function checkPostcodePlace(code: string, place: Place): "place" | "wrong" {
  const c = code.trim();
  const rows = /^[0-9]{5}$/.test(c) ? CODES[c] : undefined;
  if (!rows) return "wrong";
  const p = { subdistrict: clean(place.subdistrict), district: clean(place.district), province: clean(place.province) };
  return rows.some(([s, d, pr]) => s === p.subdistrict && d === p.district && pr === p.province) ? "place" : "wrong";
}
