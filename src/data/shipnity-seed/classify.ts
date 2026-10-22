/**
 * OKami24 — Phase 2.4/2.5: Active Catalog Seed, classification layer.
 *
 * Pure derivation from `active-catalog-source.ts`'s raw labels. Never mutates the raw
 * transcription; only reads it. Classification is intentionally NOT reused from the Phase 2.2
 * Excel-derived 98-group analysis — the active ("มีของ") view often shows a different subset
 * of children than the historical Excel export did, so every record here is (re)classified from
 * exactly the raw labels currently in the active view.
 *
 * === Three distinct facts, kept distinct on purpose (not merged into one confidence score) ===
 * 1. `rawLabel` (on the record, from the source layer) — always a literal UI transcription.
 * 2. `optionType` + `optionTypeProvenance` — WHAT semantic axis this child represents:
 *    `confirmed-owner` (owner confirmed the whole parent group's axis — always wins, never
 *    downgraded by a per-child keyword collision), `inferred` (keyword/heuristic — including
 *    group-context reconciliation, see below), or `unresolved` (no evidence, no guess).
 * 3. `childRole` — WHETHER this child is a product-variant option at all, independent of
 *    optionType. See `ChildRole` doc.
 *
 * === Group-context reconciliation (Phase 2.5 revision) ===
 * A single keyword list checked in isolation misclassifies real cases: "Orange" (a genuine
 * device color on Pod-179) also appears in the flavor vocabulary; "Pink Berry" / "Green Tea" /
 * "White Slush" carry BOTH a color word and a flavor word in the same label; "Hales Blue Boy" (a
 * real mango-variety flavor name) contains the standalone word "Blue" with no flavor keyword
 * anywhere else in the label to disambiguate it from a per-label view alone.
 *
 * None of these can be resolved by picking one axis to check first globally — "Orange" is a
 * color on Pod-179 and would legitimately be a flavor elsewhere. The fix is per-PARENT, not
 * per-word: `classifyParentChildren` looks at the whole sibling group before deciding. If a
 * parent's other children establish an overwhelming, coherent single axis (see thresholds
 * below), an ambiguous/conflicting child is reinterpreted onto that axis — always as `inferred`
 * provenance, never `confirmed-owner`, and the sibling group is NEVER forced onto one axis when
 * both axes have real (non-isolated) representation — that stays a genuine, reported deviation
 * (see `mixedAxisError` in `active-catalog-to-product-master.ts`).
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
  // Round list19 (18/10, owner "list everything", via Friday): Marbo Saltnic flavours are sold under pack colours ("Gold",
  // "Blue", one "Purple 50mg") — colour words + one mg mark would read as a mixed axis; every child is one flavour bottle.
  "ELIQUID-1": "flavor",
  // Round list19 (19/10): Marbo Freebase — same bottle line sold under colours + one flavour name; every child is one flavour bottle.
  "Eliquid-109": "flavor",
  // Round p63 (18/10): TEREA packs are named by colour line ("Black Green", "Sienna") but each one is a flavour —
  // iqos.com/id sells them as flavours (rasa); as "colour" the card read "22 สี".
  "IQOSHEET-15": "flavor",
  // Image sweep (19/10): Super Cool Salt Nic (Max ELQ-6) — e-liquid flavours whose names carry colour words ("Pinky Blush", "White Polo",
  // "Black Hexx"); every child is one flavour bottle (COF Super Cool Salt Series label), not a colour.
  "SUPER-COOL-SALTNIC": "flavor",
  // maxlist (20/10): RELX Infinity Pro 2 pods (Max Pod-27) — 42 flavour pods; Max writes the 50 mg ones as "<flavour> Nic / 50mg." — a nicotine mark
  // on a flavour pod would read as a mixed axis, but every child is one flavour pod (the pack prints the flavour + its nicotine strength).
  "RELX-INFINITY-PRO-2-POD": "flavor",
  // line 2 max-sync (22/10): RELX Creator Pod 20K (Max Pod-137) — 31 flavour pods, the 5% ones written "<flavour> 5%".
  "RELX-CREATOR-POD-20K": "flavor",
  // maxlist (21/10): VOOPOO Argus Pod cartridges (Max Coil-21) — the four options are the cartridge versions the warehouse sells: the new-version "Argus mix",
  // 1.2Ω, and two Top Fill (0.4Ω / 0.7Ω, 2ml). "Argus mix" carries no resistance mark and was dropped as unresolved (the one in-stock option vanished).
  "Coil-21": "resistance",
  "coil-78": "resistance", // not present in the active view, kept for completeness/documentation
};

// "orange" is deliberately in BOTH lists — it is a real device color (Pod-179) AND a real flavor
// word elsewhere (Orange Sour, Orange Soda). This is exactly the kind of word group-context
// reconciliation exists for; it must never be hard-assigned to one axis globally.
const COLOR_WORDS = [
  "black", "white", "blue", "red", "silver", "gold", "golden", "grey", "gray", "pink", "purple", "green",
  "navy", "champagne", "gunmetal", "copper", "teal", "charcoal", "neon", "olive", "brown", "cyan",
  "rose", "bronze", "titanium", "glit", "slate", "ash", "pebble", "azure", "breeze", "oasis",
  "bright", "beige", "sapphire", "midnight", "aspen", "terracotta", "violet", "razer", "supreme",
  "lava", "aurora", "twilight", "stripe", "matcha", "clear", "sienna", "emerald", "ruby", "pearl",
  "orange",
  // TEREA pack lines (IQOSHEET-15): iqos.com/id names some by line, not colour — "Dimension(s) Apricity / Yugen",
  // "Berrine / Mulint Edition". Without these words the 4 stayed "unresolved" and dropped off the page (round p63, 16/10).
  "dimension", "edition",
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
  // round list19 (18/10): KS Quikpro "Mineral" — a flavour on kardinal.com/products/quikpro; without it the child stayed unresolved.
  "mineral",
  // round list19 (18/10): Pop Up 10K "Malee" (a fruit-juice flavour) stayed unresolved without it.
  "malee",
  // round list19 (18/10): INFY PLUS "Tropical Mix Fruit" and "Sprite" (a soda flavour) stayed unresolved and dropped off the page.
  "tropical", "sprite",
  "องุ่น", "แตงโม", "สตรอเบอร์รี่", "มะม่วง", "แอปเปิ้ล", "มินท์", "เมนทอล", "บลูเบอร์รี่",
  "ลิ้นจี่", "โคล่า", "กล้วย", "มะนาว", "ยาสูบ", "แตง", "ฝรั่ง",
];
const RESISTANCE_MARK = /\d+(\.\d+)?\s*(Ω|ohm|โอห์ม)/i;
const SIZE_MARK = /\d+(\.\d+)?\s*(ml|มล)\.?/i;
const STRENGTH_MARK = /\d+\s*mg/i;
// Phase 2.8 fix: "ตัว"/"หัว" used to be wrapped in \b...\b, but JS \b is an ASCII word-boundary
// only — Thai script is never \w, so a boundary never forms next to it and \bหัว\b/\bตัว\b could
// NEVER match (a real bug: "Black / 1 หัว" was never split, the whole raw label leaked through
// as the option value). These two are matched as exact TOKENS instead (see `isPackagingPhrase`
// below), not substrings — "หัว" is also a substring of unrelated real words already present in
// this dataset (e.g. "หัวเปล่า" appears in several product names), so a substring match would
// misfire. The other phrases here are either multi-character (safe as substrings) or ASCII
// ("pack", where \b works correctly), so they keep working exactly as before.
const PACKAGING_PHRASE_SUBSTRINGS = ["กล่อง", "ยกกล่อง", "แพ็ค", "ลัง", "ต่อตัว", "ขายยกกล่อง", "1 ซอง"];
const PACKAGING_PHRASE_TOKENS = ["ตัว", "หัว"];
const ENGLISH_PACKAGING_WORD = /\bpack\b/i;

// Small, evidence-driven list — only expanded when a real active record needs it (currently
// just "ฐานแบตเตอรี่" / Pod-154-19). Not a guess at every possible accessory word.
const ACCESSORY_WORDS = ["ฐาน", "แบตเตอรี่", "อะไหล่", "สายชาร์จ", "charger", "adapter"];

// \p{M} (combining marks) must stay attached to their base letter — Thai vowel/tone signs like
// ิ/ุ/้ are Unicode category Mn, not \p{L}, so splitting on "anything that isn't a letter" alone
// fractures Thai words (e.g. "เงิน" without \p{M} splits into unmatchable fragments).
function tokenize(text: string): string[] {
  return text.toLowerCase().split(/[^\p{L}\p{N}\p{M}]+/gu).filter(Boolean);
}

/**
 * Color words are matched as whole tokens, not substrings — "blue" must NOT match inside
 * "Blueberry" (a real bug found in Phase 2.5: several flavor names were misread as colors
 * purely because a color word happened to be a substring of a longer flavor word).
 */
function matchesColorWord(text: string): boolean {
  const tokens = new Set(tokenize(text));
  return COLOR_WORDS.some((w) => (w.includes(" ") ? text.toLowerCase().includes(w) : tokens.has(w)));
}

/**
 * Flavor words are still matched as substrings — deliberately, unlike color. Product naming
 * frequently compounds flavor vocabulary into one word with no separator (e.g. "Mixberry"
 * contains "berry" with no space) in a way color naming in this dataset never does. Requiring
 * whole-token matches here would silently turn many real flavor names into "unresolved".
 */
function matchesFlavorWord(text: string): boolean {
  const low = text.toLowerCase();
  return FLAVOR_WORDS.some((w) => low.includes(w));
}

/** See the PACKAGING_PHRASE_* comment above for why "ตัว"/"หัว" must be token-matched. */
function isPackagingPhrase(text: string): boolean {
  const low = text.toLowerCase();
  if (PACKAGING_PHRASE_SUBSTRINGS.some((w) => low.includes(w))) return true;
  if (ENGLISH_PACKAGING_WORD.test(text)) return true;
  const tokens = tokenize(text);
  return PACKAGING_PHRASE_TOKENS.some((w) => tokens.includes(w));
}

interface BaseSignal {
  rawLabel: string;
  value: string;
  note: string | null;
  numericAxis: "resistance" | "size" | "strength" | null;
  colorMatch: boolean;
  flavorMatch: boolean;
}

/**
 * Splits a raw label into {value, note} on the first " / " separator when the right-hand side
 * reads as a packaging/unit-of-sale phrase. Never guesses a split that isn't textually present.
 */
function splitPackaging(rawLabel: string): { value: string; note: string | null } {
  const parts = rawLabel.split(" / ");
  if (parts.length >= 2 && isPackagingPhrase(parts[parts.length - 1])) {
    return { value: parts.slice(0, -1).join(" / ").trim(), note: parts[parts.length - 1].trim() };
  }
  return { value: rawLabel.trim(), note: null };
}

function detectNumericAxis(text: string): BaseSignal["numericAxis"] {
  if (RESISTANCE_MARK.test(text)) return "resistance";
  if (SIZE_MARK.test(text)) return "size";
  if (STRENGTH_MARK.test(text)) return "strength";
  return null;
}

function baseSignal(rawLabel: string): BaseSignal {
  const { value, note } = splitPackaging(rawLabel);
  let subject = value;
  let numericAxis = detectNumericAxis(subject);
  let colorMatch = matchesColorWord(subject);
  let flavorMatch = matchesFlavorWord(subject);
  // If splitting off the packaging side removed the only semantic signal, fall back to
  // checking the untouched raw label once — never invent a value that isn't in the text.
  if (!numericAxis && !colorMatch && !flavorMatch) {
    subject = rawLabel;
    numericAxis = detectNumericAxis(subject);
    colorMatch = matchesColorWord(subject);
    flavorMatch = matchesFlavorWord(subject);
  }
  return { rawLabel, value, note, numericAxis, colorMatch, flavorMatch };
}

/**
 * Strips packaging/unit-of-sale vocabulary and digits/punctuation from the full raw label and
 * returns whatever text remains. Used only to decide `childRole` for children whose optionType
 * came back "unresolved": if nothing substantial is left, the label was packaging/quantity text
 * through and through ("sell-unit"); if a real name-like remainder survives, the label
 * differentiates something we just can't type yet — stays "unresolved".
 */
const PACKAGING_TOKENS = /(ขายยกกล่อง|ยกกล่อง|กล่อง|ต่อตัว|ตัว|หัว|ซอง|แพ็ค|pack|ลัง|มี|\d+(\.\d+)?|[/.,()]+)/gi;
function nonPackagingResidue(text: string): string {
  return text.replace(PACKAGING_TOKENS, "").replace(/\s+/g, " ").trim();
}

function deriveChildRole(optionType: OptionType, rawLabel: string): ChildRole {
  if (optionType !== "unresolved") return "variant";
  const low = rawLabel.toLowerCase();
  if (ACCESSORY_WORDS.some((w) => low.includes(w.toLowerCase()))) return "accessory-component";
  if (nonPackagingResidue(rawLabel).length === 0) return "sell-unit";
  return "unresolved";
}

function unresolvedResult(b: BaseSignal): ClassifiedValue {
  const isPureNote = b.note !== null && b.value.length === 0;
  const cleanedValue = isPureNote ? null : b.value || null;
  const packagingNote = b.note ?? (isPackagingPhrase(b.rawLabel) ? b.rawLabel : null);
  return {
    optionType: "unresolved",
    optionTypeProvenance: "unresolved",
    cleanedValue,
    packagingNote,
    childRole: deriveChildRole("unresolved", b.rawLabel),
  };
}

function resolvedResult(axis: Exclude<OptionType, "unresolved">, provenance: Provenance, b: BaseSignal): ClassifiedValue {
  return {
    optionType: axis,
    optionTypeProvenance: provenance,
    cleanedValue: b.value || null,
    packagingNote: b.note,
    childRole: "variant",
  };
}

/**
 * Classifies every child under one parent together, so color/flavor ambiguity can be resolved
 * from group context (see file header). `rawLabels` must all belong to the SAME
 * `shipnityProductId` — call this once per parent, not once per child.
 */
export function classifyParentChildren(shipnityProductId: string, rawLabels: string[]): ClassifiedValue[] {
  const ownerType = OWNER_CONFIRMED_PARENT_TYPE[shipnityProductId];
  const bases = rawLabels.map(baseSignal);

  if (ownerType) {
    // Group-level owner confirmation always wins — see file header. Never downgraded to
    // "inferred" just because a token also happens to match an unrelated keyword.
    return bases.map((b) => resolvedResult(ownerType as Exclude<OptionType, "unresolved">, "confirmed-owner", b));
  }

  // Numeric-pattern axes (Ω/ml/mg) are exclusive and trustworthy by construction — never subject
  // to color/flavor group reconciliation.
  const nonNumeric = bases.filter((b) => !b.numericAxis);
  const confidentColor = nonNumeric.filter((b) => b.colorMatch && !b.flavorMatch);
  const confidentFlavor = nonNumeric.filter((b) => b.flavorMatch && !b.colorMatch);
  const colorN = confidentColor.length;
  const flavorN = confidentFlavor.length;

  let dominantAxis: "color" | "flavor" | null = null;
  if (colorN > 0 && flavorN === 0) dominantAxis = "color";
  else if (flavorN > 0 && colorN === 0) dominantAxis = "flavor";
  else if (colorN > 0 && flavorN > 0) {
    // Both axes have SOME confident representation. Only collapse onto one when the other side
    // is a truly isolated outlier (exactly 1) against a real, established pattern (>=3
    // corroborating siblings) — anything more than an isolated single outlier is treated as
    // genuine multi-dimension evidence and left as a reported deviation, never forced.
    const minority = Math.min(colorN, flavorN);
    const majority = Math.max(colorN, flavorN);
    if (minority <= 1 && majority >= 3) {
      dominantAxis = colorN > flavorN ? "color" : "flavor";
    }
    // else: dominantAxis stays null — genuine mixed group, not resolved here.
  }

  return bases.map((b) => {
    if (b.numericAxis) return resolvedResult(b.numericAxis, "inferred", b);

    const isConflicted = b.colorMatch && b.flavorMatch;
    const isConfidentColor = b.colorMatch && !b.flavorMatch;
    const isConfidentFlavor = b.flavorMatch && !b.colorMatch;

    if (dominantAxis) {
      const needsReinterpretation =
        isConflicted || (isConfidentColor && dominantAxis === "flavor") || (isConfidentFlavor && dominantAxis === "color");
      if (needsReinterpretation) return resolvedResult(dominantAxis, "inferred", b);
    }
    if (isConfidentColor) return resolvedResult("color", "inferred", b);
    if (isConfidentFlavor) return resolvedResult("flavor", "inferred", b);

    // Either no evidence at all, or conflicted with no resolvable group dominance (genuine
    // mixed-axis group) — never guessed.
    return unresolvedResult(b);
  });
}
