/** T2-31 — which products with two "all colours" images get range chips ("สีที่ 1–4" / "สีที่ 5–8") and which keep the
 *  numbered fallback. A product leaving the fallback list on purpose = update FALLBACK here; one leaving it by a data
 *  slip (a new lineupImage2 whose alt has no range) fails. Run: npx tsx src/lib/lineup-groups-contract-test.ts */
import { allProducts } from "@/data/products";
import { LINEUP_GROUP_NAMES, lineupGroupRanges } from "./lineup-groups";

const FALLBACK = new Set(["zero-pro", "caliburn-g4-mini"]);

export function runLineupGroupsContractTests() {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const withTwo = allProducts.filter((p) => p.lineupImage2);
  results.push({ name: "some products have a second lineup image", passed: withTwo.length > 0, detail: `${withTwo.length}` });
  for (const p of withTwo) {
    const colours = p.colorVariants?.length ?? 0;
    const r = lineupGroupRanges(p.lineupImage?.alt, p.lineupImage2?.alt, colours);
    results.push({
      name: `${p.slug}: ${FALLBACK.has(p.slug) ? "numbered fallback chips" : "range chips matching its colour count"}`,
      passed: FALLBACK.has(p.slug) ? r === null : r !== null,
      detail: `alts "${p.lineupImage?.alt}" / "${p.lineupImage2?.alt}" → ${JSON.stringify(r)} · colours ${colours}`,
    });
  }
  for (const [slug, names] of Object.entries(LINEUP_GROUP_NAMES)) {
    const p = allProducts.find((x) => x.slug === slug);
    results.push({ name: `${slug}: named chips — one name per image, every language filled`, passed: !!p?.lineupImage2 && names.length === 2 && names.every((n) => n.th && n.en && n.zh), detail: "" });
  }
  results.push({ name: "an alt without a range gives no range", passed: lineupGroupRanges("X, colours 1–4 of 8", "X, all colours", 8) === null, detail: "" });
  return results;
}

if (require.main === module) {
  const results = runLineupGroupsContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
