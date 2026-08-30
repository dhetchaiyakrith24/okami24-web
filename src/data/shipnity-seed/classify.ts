/**
 * OKami24 — Phase 2.4: Active Catalog Seed, classification layer.
 *
 * Pure derivation from `active-catalog-source.ts`'s raw labels. Never mutates the raw
 * transcription; only reads it. Classification is intentionally NOT reused from the Phase 2.2
 * Excel-derived 98-group analysis — the active ("มีของ") view often shows a different subset
 * of children than the historical Excel export did (e.g. Coil-21 historically had resistance-
 * bearing children, but its only *active* child today is "Argus mix (coil เวอร์ชั่นใหม่)", which
 * has no resistance marker at all) — carrying forward the old group-level verdict would silently
 * launder a historical inference onto data it was never actually derived from. Every record here
 * is (re)classified from exactly the raw labels currently in the active view.
 *
 * === Three distinct facts, kept distinct on purpose (not merged into one confidence score) ===
 * 1. `rawLabel` (on the record, from the source layer) — always a literal UI transcription.
 * 2. `optionType` + `optionTypeProvenance` — WHAT semantic axis this child represents, and
 *    whether that axis comes from an owner/UI-confirmed decision about the whole parent group
 *    (`confirmed-owner`) or from a keyword heuristic on this one label (`inferred`), or neither
 *    (`unresolved`). A group-level owner confirmation is a fact about the GROUP, not about
 *    whether any single child's text happens to contain a matching keyword — so it is never
 *    downgraded to "inferred" just because one label (e.g. "Lemon Mint" under the owner-
 *    confirmed Pod-173=color group) also happens to contain an unrelated keyword.
 * 3. `childRole` — WHETHER this child is a product-variant option at all, independent of
 *    optionType (see `deriveChildRole` below). A Shipnity child code does not always mean a
 *    ProductVariant — see `ChildRole` doc.
 */

export type OptionType = "color" | "flavor" | "resistance" | "size" | "strength" | "unresolved";
export type Provenance = "confirmed-owner" | "inferred" | "unresolved";

/**
 * How OKami24 interprets this Shipnity child — NOT a claim about Shipnity's own internal data
 * model, purely how this seed treats the row:
 * - "variant"             — a real product-variant option (color/flavor/resistance/size/strength).
 * - "accessory-component" — a spare part/component sold under the same parent, not an option of
 *                            the product itself (e.g. "ฐานแบตเตอรี่" — a battery base/stand).
 * - "sell-unit"            — packaging/unit-of-sale text only, no differentiating semantic value
 *                            at all (e.g. "1 กล่อง / มี 2ตัว").
 * - "unresolved"           — genuinely ambiguous; not enough evidence for any of the above.
 */
export type ChildRole = "variant" | "accessory-component" | "sell-unit" | "unresolved";

export interface ClassifiedValue {
  optionType: OptionType;
  optionTypeProvenance: Provenance;
  /** Semantic value with any packaging/unit-of-sale note stripped out. Null if unresolved. */
  cleanedValue: string | null;
  /** Unit-of-sale / packaging annotation split out of the raw label, if any (e.g. "ยกกล่อง"). */
  packagingNote: string | null;
  childRole: ChildRole;
}

// ===================================================================================
// Owner decisions carried forward verbatim from Phase 2.2/2.4 review (this conversation).
// This is a GROUP-level fact ("Pod-173's children are color variants") — applied to every
// child under the named parent, regardless of whether that specific child's text independently
// contains a matching keyword. Per-child `cleanedValue`/`packagingNote` are still derived
// mechanically below, never invented — a genuinely unparseable value stays null.
// ===================================================================================
const OWNER_CONFIRMED_PARENT_TYPE: Record<string, OptionType> = {
  "Pod-173": "color",
  "coil-62": "color",
  "Eliquid-66": "flavor",
  "coil-78": "resistance", // not present in the active view, kept for completeness/documentation
};

const COLOR_WORDS = [
  "black", "white", "blue", "red", "silver", "gold", "grey", "gray", "pink", "purple", "green",
  "navy", "champagne", "gunmetal", "copper", "teal", "charcoal", "neon", "olive", "brown", "cyan",
  "rose", "bronze", "titanium", "glit", "slate", "ash", "pebble", "azure", "breeze", "oasis",
  "bright", "beige", "sapphire", "midnight", "aspen", "terracotta", "violet", "razer", "supreme",
  "lava", "aurora", "twilight", "stripe", "matcha", "clear", "sienna", "emerald", "ruby", "pearl",
  "สี", "ดำ", "แดง", "ขาว", "เขียว", "เหลือง", "น้ำเงิน", "ฟ้า", "ม่วง", "ชมพู", "เทา", "ทอง",
  "เงิน", "น้ำตาล", "ส้ม", "ครีม",
];
const FLAVOR_WORDS = [
  "grape", "mint", "strawberry", "blueberry", "watermelon", "mango", "apple", "banana", "berry",
  "berries", "lychee", "cola", "coke", "honeydew", "melon", "kiwi", "peach", "bubblegum", "candy",
  "custard", "ice", "aloe", "menthol", "tobacco", "cool", "sour", "soda", "energy", "milk",
  "yogurt", "taro", "coconut", "lime", "lemon", "cherry", "guava", "passion", "sakura", "extreme",
  "slush", "pineapple", "tea", "gummy", "gummies", "jelly", "cream", "raspberry", "shisha",
  "mangosteen", "hales", "vanilla", "yakult", "baraku", "fanta", "sugus", "jele", "bear", "click",
  "twist", "fizzy", "orange", "mixed", "muro", "smooth", "spearmint",
  "องุ่น", "แตงโม", "สตรอเบอร์รี่", "มะม่วง", "แอปเปิ้ล", "มินท์", "เมนทอล", "บลูเบอร์รี่",
  "ลิ้นจี่", "โคล่า", "กล้วย", "มะนาว", "ยาสูบ", "แตง", "ฝรั่ง",
];
const RESISTANCE_MARK = /\d+(\.\d+)?\s*(Ω|ohm|โอห์ม)/i;
const SIZE_MARK = /\d+(\.\d+)?\s*(ml|มล)\.?/i;
const STRENGTH_MARK = /\d+\s*mg/i;
const PACKAGING_PHRASE = /กล่อง|ยกกล่อง|แพ็ค|\bpack\b|ลัง|ต่อตัว|ขายยกกล่อง|1 ซอง|\bตัว\b|\bหัว\b/i;

// Small, evidence-driven list — only expanded when a real active record needs it (currently
// just "ฐานแบตเตอรี่" / Pod-154-19). Not a guess at every possible accessory word.
const ACCESSORY_WORDS = ["ฐาน", "แบตเตอรี่", "อะไหล่", "สายชาร์จ", "charger", "adapter"];

function detectAxis(text: string): OptionType | null {
  if (RESISTANCE_MARK.test(text)) return "resistance";
  if (SIZE_MARK.test(text)) return "size";
  if (STRENGTH_MARK.test(text)) return "strength";
  const low = text.toLowerCase();
  if (COLOR_WORDS.some((w) => low.includes(w))) return "color";
  if (FLAVOR_WORDS.some((w) => low.includes(w))) return "flavor";
  return null;
}

/**
 * Splits a raw label into {value, note} on the first " / " separator when the right-hand side
 * reads as a packaging/unit-of-sale phrase. Never guesses a split that isn't textually present.
 */
function splitPackaging(rawLabel: string): { value: string; note: string | null } {
  const parts = rawLabel.split(" / ");
  if (parts.length >= 2 && PACKAGING_PHRASE.test(parts[parts.length - 1])) {
    return { value: parts.slice(0, -1).join(" / ").trim(), note: parts[parts.length - 1].trim() };
  }
  return { value: rawLabel.trim(), note: null };
}

/**
 * Strips packaging/unit-of-sale vocabulary and digits/punctuation from the full raw label and
 * returns whatever text remains. Used only to decide `childRole` for children whose optionType
 * came back "unresolved": if nothing substantial is left, the label was packaging/quantity text
 * through and through ("sell-unit"); if a real name-like remainder survives ("Dimension
 * Apricity"), the label differentiates something we just can't type yet — stays "unresolved",
 * never forced into "sell-unit" or "variant".
 */
const PACKAGING_TOKENS = /(ขายยกกล่อง|ยกกล่อง|กล่อง|ต่อตัว|ตัว|หัว|ซอง|แพ็ค|pack|ลัง|มี|\d+(\.\d+)?|[/.,()]+)/gi;
function nonPackagingResidue(text: string): string {
  return text.replace(PACKAGING_TOKENS, "").replace(/\s+/g, " ").trim();
}

function deriveChildRole(
  optionType: OptionType,
  rawLabel: string,
  cleanedValue: string | null
): ChildRole {
  if (optionType !== "unresolved") return "variant";

  const low = rawLabel.toLowerCase();
  if (ACCESSORY_WORDS.some((w) => low.includes(w.toLowerCase()))) return "accessory-component";

  if (nonPackagingResidue(rawLabel).length === 0) return "sell-unit";

  // Something differentiating survives (e.g. "Dimension Apricity") but its type is unknown —
  // stay unresolved rather than guessing "variant" from the mere presence of a proper noun.
  void cleanedValue;
  return "unresolved";
}

export function classifyChildLabel(shipnityProductId: string, rawLabel: string): ClassifiedValue {
  const { value, note } = splitPackaging(rawLabel);

  const axisFromValue = detectAxis(value);
  // If splitting off the "packaging" side removed the only semantic signal (e.g. the whole
  // label is packaging text with no distinguishable value), fall back to checking the full
  // raw label once before giving up — but never invent a value that isn't in the text.
  const axis = axisFromValue ?? detectAxis(rawLabel);

  const ownerType = OWNER_CONFIRMED_PARENT_TYPE[shipnityProductId];

  if (ownerType) {
    // Group-level owner confirmation always wins for optionType AND provenance — see file
    // header. "Lemon Mint" under Pod-173 is color, full stop, not downgraded to "inferred"
    // just because "mint" also happens to appear in the flavor keyword list.
    const cleanedValue = value || null;
    return {
      optionType: ownerType,
      optionTypeProvenance: "confirmed-owner",
      cleanedValue,
      packagingNote: note,
      childRole: "variant",
    };
  }
  if (axis) {
    return {
      optionType: axis,
      optionTypeProvenance: "inferred",
      cleanedValue: value,
      packagingNote: note,
      childRole: "variant",
    };
  }

  // No semantic marker found anywhere in the label.
  const isPureNote = note !== null && value.length === 0;
  const cleanedValue = isPureNote ? null : value || null;
  const packagingNote = note ?? (PACKAGING_PHRASE.test(rawLabel) ? rawLabel : null);

  return {
    optionType: "unresolved",
    optionTypeProvenance: "unresolved",
    cleanedValue,
    packagingNote,
    childRole: deriveChildRole("unresolved", rawLabel, cleanedValue),
  };
}
