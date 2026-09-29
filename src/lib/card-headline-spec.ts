import type { Product, Specification } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";

/**
 * Round 30.4ข batch 2 (owner's brief 2026-09-16): the one-line "headline spec" a product card
 * shows under the name. Every number comes from a spec row whose `sourceStatus` is "verified" —
 * never from the normalized `attributes` alone (Joiway F3/F4 and the G4 Classic carry battery/puff
 * numbers there that their spec rows mark unverified; the old card printed them anyway). No
 * verified row → no line; the card keeps the row's height so a grid stays level.
 *
 * Rule per category (owner's draft, the picks are the owner's to confirm):
 *   pod-systems / pod-kits   battery + top wattage
 *   disposables              rated puffs, else battery
 *   pods-cartridges          pod capacity, else a single resistance
 *   coils-accessories        a single resistance, else capacity
 *   heated-tobacco-devices   battery
 * Wording lives in the dictionary (`catalog.cardBattery` …) so the line reads in the visitor's
 * language; the words are THAI_STYLE §3 locked terms (แบตเตอรี่ · วัตต์ · พัฟ · โอห์ม · ความจุ).
 */
export type HeadlineSpec =
  | { kind: "battery"; mah: number }
  | { kind: "maxWatt"; w: number }
  | { kind: "puffs"; count: number }
  | { kind: "resistance"; ohm: string }
  | { kind: "capacity"; ml: string };

type Row = Pick<Specification, "key" | "value" | "sourceStatus">;

const verifiedRow = (rows: readonly Row[], key: string) =>
  rows.find((r) => r.key === key && r.sourceStatus === "verified");

// "1600mAh built-in" → 1600 · "Single external 18650 …" → undefined
const parseMah = (v: string) => {
  const m = v.match(/(\d{3,5})\s*mAh/i);
  return m ? Number(m[1]) : undefined;
};
// "5–35W" / "35W" / "30W (auto-adjusts …)" / "10-16W (…)" → the top number
const parseMaxW = (v: string) => {
  const m = v.match(/(?:\d+(?:\.\d+)?\s*[–-]\s*)?(\d+(?:\.\d+)?)\s*W\b/);
  return m ? Number(m[1]) : undefined;
};
// "Up to 10,000" → 10000 · a value with two figures ("~15,000 / ~30,000") is not one number → undefined
const parsePuffs = (v: string) => {
  const all = v.match(/\d{1,3}(?:,\d{3})+|\d{4,6}/g);
  return all && all.length === 1 ? Number(all[0].replace(/,/g, "")) : undefined;
};
// "0.7Ω" / "1.0Ω" → "0.7" / "1.0" · a range or a list ("0.4–3.0Ω", "0.4Ω / 0.6Ω …") → undefined
const parseSingleOhm = (v: string) => {
  const m = v.trim().match(/^(\d+(?:\.\d+)?)\s*Ω$/);
  return m ? m[1] : undefined;
};
// "3mL, top-fill" / "2.0 ml" / "5.5 ml" / "~18 mL" / "4.5mL (2mL in TPD regions)" → "3" / "2" / "5.5" / "18" / "4.5"
const parseMl = (v: string) => {
  const m = v.match(/~?\s*(\d+(?:\.\d+)?)\s*m[lL]\b/);
  if (!m) return undefined;
  const n = Number(m[1]);
  return Number.isInteger(n) ? String(n) : String(n);
};

function battery(rows: readonly Row[], fallback?: number): HeadlineSpec | undefined {
  const r = verifiedRow(rows, "battery");
  if (!r) return undefined;
  const mah = parseMah(r.value) ?? fallback;
  return mah ? { kind: "battery", mah } : undefined;
}
function maxWatt(rows: readonly Row[], fallback?: number): HeadlineSpec | undefined {
  const r = verifiedRow(rows, "output") ?? verifiedRow(rows, "wattage");
  if (!r) return undefined;
  const w = parseMaxW(r.value) ?? fallback;
  return w ? { kind: "maxWatt", w } : undefined;
}
function puffs(rows: readonly Row[], fallback?: number): HeadlineSpec | undefined {
  const r = verifiedRow(rows, "puffs");
  if (!r) return undefined;
  const count = parsePuffs(r.value) ?? fallback;
  return count ? { kind: "puffs", count } : undefined;
}
function resistance(rows: readonly Row[]): HeadlineSpec | undefined {
  const r = verifiedRow(rows, "resistance");
  const ohm = r && parseSingleOhm(r.value);
  return ohm ? { kind: "resistance", ohm } : undefined;
}
function capacity(rows: readonly Row[], fallback?: number): HeadlineSpec | undefined {
  const r = verifiedRow(rows, "capacity") ?? verifiedRow(rows, "pod");
  if (!r) return undefined;
  const ml = parseMl(r.value) ?? (fallback ? String(fallback) : undefined);
  return ml ? { kind: "capacity", ml } : undefined;
}

function pick(
  categoryId: string,
  rows: readonly Row[],
  attrs: { batteryMah?: number; wattageMax?: number; puffCount?: number; capacityMl?: number } = {}
): HeadlineSpec[] {
  const nonEmpty = (xs: Array<HeadlineSpec | undefined>) => xs.filter((x): x is HeadlineSpec => Boolean(x));
  switch (categoryId) {
    case "pod-systems":
    case "pod-kits":
      return nonEmpty([battery(rows, attrs.batteryMah), maxWatt(rows, attrs.wattageMax)]);
    case "disposables":
      // A disposable with no verified puff figure but a verified battery shows that.
      return nonEmpty([puffs(rows, attrs.puffCount) ?? battery(rows, attrs.batteryMah)]);
    case "pods-cartridges":
      return nonEmpty([capacity(rows, attrs.capacityMl) ?? resistance(rows)]);
    case "coils-accessories":
      return nonEmpty([resistance(rows) ?? capacity(rows, attrs.capacityMl)]);
    case "heated-tobacco-devices":
      return nonEmpty([battery(rows, attrs.batteryMah)]);
    default:
      return [];
  }
}

/** Legacy catalog product (src/data/products). */
export function headlineSpecsForProduct(product: Product): HeadlineSpec[] {
  return pick(product.categoryId, product.specifications, product.attributes);
}

/** Published ProductMaster product (storefront bridge) — spec rows only, no attributes. */
export function headlineSpecsForPublished(product: StorefrontProductView): HeadlineSpec[] {
  return pick(product.categoryId, product.specifications);
}
