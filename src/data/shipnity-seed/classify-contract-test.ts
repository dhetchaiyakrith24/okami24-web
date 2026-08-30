/**
 * OKami24 — Phase 2.5 revision: classify.ts group-context reconciliation, contract tests.
 *
 * Synthetic fixtures proving the rules from the classify.ts file header: an isolated outlier
 * inherits the group's coherent axis as `inferred`; a genuinely mixed group is never forced
 * onto one axis; owner-confirmed groups and numeric axes are unaffected. Same lightweight
 * convention as every other Phase 2 contract-test file — run via throwaway `npx tsx`.
 */

import { classifyParentChildren } from "./classify";

export interface ClassifyContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runClassifyContractTests(): ClassifyContractResult[] {
  const results: ClassifyContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  // ---- 1. Isolated color outlier ("Orange") among a coherent color group, via ambiguous word ----
  {
    const r = classifyParentChildren("Test-Device", ["Black", "Gray", "Brown", "Blue", "Orange"]);
    const orange = r[4];
    check(
      'isolated ambiguous "Orange" inherits the group\'s color axis as inferred (not confirmed, not flavor)',
      orange.optionType === "color" && orange.optionTypeProvenance === "inferred",
      JSON.stringify(orange)
    );
    check("the other 4 confidently-color siblings are unaffected", r.slice(0, 4).every((c) => c.optionType === "color"), JSON.stringify(r.slice(0, 4)));
  }

  // ---- 2. Isolated confident-but-wrong-axis outlier ("Hales Blue Boy") among a flavor group ----
  {
    const labels = ["Coke", "Strawberry", "Mixberry", "Mangosteen", "Pineapple", "Raspberry", "Hales Blue Boy", "Lime Soda", "Guava Kiwi", "Lychee", "Jelly Bear"];
    const r = classifyParentChildren("Test-Pod", labels);
    const outlier = r[6];
    check(
      'a single confidently-color-only outlier ("Hales Blue Boy" — contains "Blue" with no co-occurring flavor word) is reinterpreted to the dominant flavor axis',
      outlier.optionType === "flavor" && outlier.optionTypeProvenance === "inferred",
      JSON.stringify(outlier)
    );
  }

  // ---- 3. Genuine multi-dimension group is NEVER forced onto one axis ----
  {
    // 5 confident color + 5 confident flavor — neither side is an isolated outlier, so this must
    // stay unresolved for the ambiguous/conflicting members and split for the confident ones,
    // never silently collapsed onto a single axis.
    const labels = ["Black", "White", "Silver", "Gold", "Teal", "Grape", "Strawberry", "Mango", "Lychee", "Vanilla"];
    const r = classifyParentChildren("Test-Mixed", labels);
    const types = new Set(r.map((c) => c.optionType));
    check(
      "a genuinely balanced color/flavor split is preserved as two real axes, never forced onto one",
      types.has("color") && types.has("flavor"),
      JSON.stringify(r.map((c, i) => ({ label: labels[i], type: c.optionType })))
    );
  }

  // ---- 4. No group anchor at all (single child, conflicting signal) stays unresolved ----
  {
    const r = classifyParentChildren("Test-Single", ["Thai Milk Green Tea"]);
    check(
      "a lone child with both a color word (green) and flavor words (milk/tea) and no siblings to anchor against stays unresolved, never guessed",
      r[0].optionType === "unresolved" && r[0].optionTypeProvenance === "unresolved",
      JSON.stringify(r[0])
    );
  }

  // ---- 5. Owner-confirmed group still wins outright, unaffected by reconciliation ----
  {
    const r = classifyParentChildren("Pod-173", ["Razer Black", "Supreme Red", "Lemon Mint"]);
    check(
      "owner-confirmed axis (Pod-173=color) still overrides everything, including a flavor-keyword collision",
      r.every((c) => c.optionType === "color" && c.optionTypeProvenance === "confirmed-owner"),
      JSON.stringify(r)
    );
  }

  // ---- 6. Numeric axes (Ω/ml/mg) are exclusive and untouched by color/flavor reconciliation ----
  {
    const r = classifyParentChildren("Test-Coil", ["0.4Ω / ยกกล่อง", "0.6Ω / ยกกล่อง", "Black"]);
    check(
      "resistance children keep their numeric axis regardless of an unrelated color sibling",
      r[0].optionType === "resistance" && r[1].optionType === "resistance",
      JSON.stringify(r.slice(0, 2))
    );
  }

  // ---- 7. Blueberry-in-color substring bug does not recur ----
  {
    const r = classifyParentChildren("Test-Flavor", ["Grape", "Blueberry", "Strawberry"]);
    check(
      '"Blueberry" is never misread as color via the "blue" substring',
      r.every((c) => c.optionType === "flavor"),
      JSON.stringify(r)
    );
  }

  // ---- 8. Phase 2.8 regression: Thai packaging words "ตัว"/"หัว" — \b never matched them ----
  {
    // The real reported bug: "Black / 1 หัว" (Coil-87) leaked through unsplit.
    const r1 = classifyParentChildren("Test-Packaging-1", ["Black / 1 หัว"]);
    check(
      '"Black / 1 หัว" splits into value="Black", note="1 หัว" (was previously left unsplit)',
      r1[0].cleanedValue === "Black" && r1[0].packagingNote === "1 หัว",
      JSON.stringify(r1[0])
    );
  }
  {
    // Same class of bug via "ตัว" — a resistance value with a per-piece unit note.
    const r2 = classifyParentChildren("Test-Packaging-2", ["0.15Ω / ตัว"]);
    check(
      '"0.15Ω / ตัว" splits into value="0.15Ω", note="ตัว"',
      r2[0].cleanedValue === "0.15Ω" && r2[0].packagingNote === "ตัว" && r2[0].optionType === "resistance",
      JSON.stringify(r2[0])
    );
  }
  {
    // False-positive guard: "หัว" must NOT match as a substring inside an unrelated real word
    // like "หัวเปล่า" (a phrase that appears in several real product names in this dataset).
    // A single-child group with no color/flavor/numeric signal and no " / " separator should
    // stay unresolved, not have "หัวเปล่า..." mistaken for a packaging note via substring.
    const r3 = classifyParentChildren("Test-Packaging-3", ["หัวเปล่าทดสอบ"]);
    check(
      '"หัวเปล่าทดสอบ" (containing "หัว" as a substring of a real word, no separator) is not misread as packaging text',
      r3[0].optionType === "unresolved" && r3[0].packagingNote === null,
      JSON.stringify(r3[0])
    );
  }

  return results;
}
