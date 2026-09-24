/**
 * OKami24 — every multi-word flavour name in the catalog is bound on one line (round 10B, owner 2026-09-24).
 *
 * src/lib/flavor-names.ts is a hand-kept list (thai-typography runs in the browser and must not import the catalog).
 * This test rebuilds the set from the data — every legacy product's flavorVariants and every published product whose
 * option axis is a flavour axis — and fails when a name with a space is missing from the list, so a flavour added next
 * month cannot silently break across two lines again. It also proves the binding itself works on one real sentence.
 *
 *   npx tsx src/lib/flavor-names-contract-test.ts          # the checks
 *   npx tsx src/lib/flavor-names-contract-test.ts --list   # print the catalog's multi-word flavour names
 */
import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { MULTI_WORD_FLAVOR_NAMES } from "@/lib/flavor-names";
import { thaiTypography } from "@/lib/thai-typography";

export interface FlavorNamesContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const FLAVOR_AXIS = /flav/i;

function catalogMultiWordFlavors(): { names: string[]; axes: string[] } {
  const names = new Set<string>();
  const axes = new Set<string>();
  // A twin-flavour name "A + B" is bound per part: the " + " stays a break point, so a two-flavour name never becomes
  // one 30-character run that could not wrap on a phone.
  const add = (raw: string) => {
    for (const part of raw.split(" + ")) if (part.trim().includes(" ")) names.add(part.trim());
  };
  for (const p of allProducts) for (const v of p.flavorVariants ?? []) add(v.name);
  for (const p of getPublishedProducts()) {
    if (p.optionAxisCode) axes.add(p.optionAxisCode);
    if (!p.optionAxisCode || !FLAVOR_AXIS.test(p.optionAxisCode)) continue;
    for (const v of p.variants) add(v.label);
  }
  return { names: [...names].sort((a, b) => b.length - a.length || a.localeCompare(b)), axes: [...axes].sort() };
}

export function runFlavorNamesContractTests(): FlavorNamesContractResult[] {
  const results: FlavorNamesContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
  const { names, axes } = catalogMultiWordFlavors();
  const listed = new Set(MULTI_WORD_FLAVOR_NAMES);

  check(`the catalog has multi-word flavour names to bind (a test that passes on nothing is no test)`, names.length > 0, `${names.length} name(s); option axes seen: ${axes.join(", ")}`);
  const missing = names.filter((n) => !listed.has(n));
  check(`every multi-word flavour in the catalog is in MULTI_WORD_FLAVOR_NAMES`, missing.length === 0, missing.length ? `missing: ${missing.join(" · ")} — add them to src/lib/flavor-names.ts` : `${names.length} bound`);
  const order = MULTI_WORD_FLAVOR_NAMES.every((n, i, a) => i === 0 || a[i - 1].length >= n.length);
  check(`MULTI_WORD_FLAVOR_NAMES is longest first (a shorter name must never bind inside a longer one first)`, order, order ? "ok" : "re-sort by length, descending");

  // the binding itself, on the sentence the designer saw break at 390 (round 10B)
  const sample = "M Switch Pod (10 กลิ่น): Mixberry · Peach Strawberry · Pink Berry";
  const out = thaiTypography(sample);
  const nbsp = String.fromCharCode(0x00a0);
  const bound = ["Peach Strawberry", "Pink Berry"].every((n) => out.includes(n.split(" ").join(nbsp)));
  check(`thaiTypography keeps a multi-word flavour on one line (NBSP inside the name)`, bound, bound ? "Peach Strawberry · Pink Berry bound" : `got: ${JSON.stringify(out)}`);
  return results;
}

if (require.main === module) {
  if (process.argv.includes("--list")) {
    const { names, axes } = catalogMultiWordFlavors();
    console.log(`// option axes seen on published products: ${axes.join(", ")}`);
    for (const n of names) console.log(`  ${JSON.stringify(n)},`);
    process.exit(0);
  }
  const results = runFlavorNamesContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
