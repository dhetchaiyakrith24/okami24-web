import type { Product, Specification } from "@/types/catalog";

/**
 * Data round (owner, 2026-09-24): every spec number a customer sees must trace back to a manufacturer source.
 * A spec row carries that trace as `sourceStatus: "verified"`; an `unverified` row is never shown as a fact.
 *
 * The legacy catalog also carries a normalized `attributes` block (battery, wattage, puffs, capacity …) that powers
 * the product-page stats, /compare's classification rows and Finder. Those numbers were typed in separately from the
 * spec rows, so they can outlive a row that was later marked unverified (Joiway F3/F4, the G4 Classic). This module
 * is the one gate between them: an attribute survives only when a VERIFIED row of the same product states the same
 * number. Matching is by value, not by row key, so a row labelled "pod" that says "3mL" backs capacityMl = 3 and a
 * rename of a key can never silently re-open a number.
 *
 * Every component that shows spec rows or attribute numbers goes through here —
 * `src/lib/verified-specs-contract-test.ts` fails when one does not.
 */

type Row = Pick<Specification, "value" | "sourceStatus">;

export function verifiedRows<T extends Row>(rows: readonly T[]): T[] {
  return rows.filter((r) => r.sourceStatus === "verified");
}

// "10,000" and "10000" are the same number in a row; the pattern accepts either spelling.
const numberPattern = (n: number) => n.toLocaleString("en-US").replace(/\./g, "\\.").replace(/,/g, ",?");
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** The attribute fields that state a manufacturer fact. Editorial classifications (drawStyle, portability,
 *  beginnerFriendly, screenType) are the shop's own filter buckets, not quoted specs, and pass through. */
type Attributes = Product["attributes"];

export function verifiedAttributes(product: { attributes: Attributes; specifications: readonly Row[] }): Attributes {
  const text = verifiedRows(product.specifications)
    .map((r) => r.value)
    .join(" | ");
  const states = (re: RegExp) => re.test(text);
  const a = product.attributes;
  const out: Attributes = { ...a };
  if (a.batteryMah !== undefined && !states(new RegExp(`${numberPattern(a.batteryMah)}\\s*mAh`, "i"))) delete out.batteryMah;
  // The top of the range is what a customer reads as "up to"; a range is kept only when its top is stated.
  if (a.wattageMax !== undefined && !states(new RegExp(`${numberPattern(a.wattageMax)}\\s*W\\b`))) {
    delete out.wattageMin;
    delete out.wattageMax;
  }
  if (a.puffCount !== undefined && !states(new RegExp(`(?<![\\d,])${numberPattern(a.puffCount)}(?![\\d,])`))) delete out.puffCount;
  if (a.capacityMl !== undefined && !states(new RegExp(`(?<![\\d.])${numberPattern(a.capacityMl)}(?:\\.0)?\\s*m[lL]\\b`))) delete out.capacityMl;
  if (a.weightG !== undefined && !states(new RegExp(`(?<![\\d.])${numberPattern(a.weightG)}\\s*g\\b`))) delete out.weightG;
  if (a.dimensions !== undefined && !text.includes(a.dimensions)) delete out.dimensions;
  if (a.screenSize !== undefined && !states(new RegExp(escape(a.screenSize.replace(/["”]$/, ""))))) delete out.screenSize;
  if (a.chargingType !== undefined && !chargingBacked(a.chargingType, text)) delete out.chargingType;
  return out;
}

/** "USB-C, 5V/2A (~45 min full charge)" is backed when a verified row names USB-C and states every number in it
 *  (5V, 2A, 45) — the wording may differ. "N/A — cartridge only" states no fact and passes; a placeholder such as
 *  "Not independently confirmed" is not a fact either and is dropped. */
function chargingBacked(charging: string, text: string): boolean {
  if (/not independently confirmed/i.test(charging)) return false;
  const lower = text.toLowerCase();
  if (/usb-?c|type-?c/i.test(charging) && !/usb-?c|type-?c/.test(lower)) return false;
  const numbers = charging.match(/\d+(?:\.\d+)?/g) ?? [];
  return numbers.every((n) => new RegExp(`(?<![\\d.])${n.replace(".", "\\.")}(?![\\d])`).test(text));
}
