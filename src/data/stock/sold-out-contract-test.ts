/**
 * Contract tests for the owner's sold-out list (sold-out.ts) — this is the typo check the file's
 * own header promises: every line must name a real product AND a real colour/flavour/variant of
 * it, and the listed options must actually come out as out-of-stock in the catalog the storefront
 * reads. Discovered and run by scripts/verify-catalog.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { parseSoldOutList, normalizeOption } from "./apply-sold-out";
import { catalogIncludingHidden } from "@/data/products";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";

export interface SoldOutContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runSoldOutContractTests(): SoldOutContractResult[] {
  const results: SoldOutContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  // Report REAL file line numbers (what the owner sees in Notepad), not positions inside the
  // template string: the string starts right after the backtick on the `export const` line.
  const listFile = path.join(process.cwd(), "src", "data", "stock", "sold-out.ts");
  const exportLine = fs.readFileSync(listFile, "utf8").split(/\r?\n/).findIndex((l) => l.includes("SOLD_OUT_LIST = `")) + 1;
  const fileLine = (line: number) => (exportLine > 0 ? exportLine + line - 1 : line);
  const parsed = parseSoldOutList();
  const entries = parsed.entries.map((e) => ({ ...e, line: fileLine(e.line) }));
  const problems = parsed.problems.map((p) => ({ ...p, line: fileLine(p.line) }));
  check("every non-comment line of sold-out.ts has the form `slug | name`", problems.length === 0, problems.map((p) => `line ${p.line}: ${p.problem} (${p.raw.trim()})`).join("; ") || `${entries.length} entries`);

  const legacyBySlug = new Map(catalogIncludingHidden.map((p) => [p.slug, p]));
  const publishedBySlug = new Map(buildPublishedCatalog().map((p) => [p.slug, p]));

  const unknownProduct: string[] = [];
  const unknownOption: string[] = [];
  for (const e of entries) {
    const legacy = legacyBySlug.get(e.slug);
    const published = publishedBySlug.get(e.slug);
    if (!legacy && !published) { unknownProduct.push(`line ${e.line}: product "${e.slug}" not found`); continue; }
    const names = legacy
      ? [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].flatMap((v) => [normalizeOption(v.name), normalizeOption(v.id)])
      : published!.variants.flatMap((v) => [normalizeOption(v.label), normalizeOption(v.id)]);
    if (!names.includes(e.option)) unknownOption.push(`line ${e.line}: "${e.slug}" has no colour/flavour named "${e.raw.split("|")[1]?.trim()}"`);
  }
  check("every listed product slug exists on the site (legacy or published ProductMaster)", unknownProduct.length === 0, unknownProduct.join("; ") || "ok");
  check("every listed colour/flavour exists on that product (typo check)", unknownOption.length === 0, unknownOption.join("; ") || "ok");

  const seen = new Set<string>();
  const dupes = entries.filter((e) => { const k = `${e.slug}|${e.option}`; if (seen.has(k)) return true; seen.add(k); return false; }).map((e) => `line ${e.line}: ${e.raw.trim()}`);
  check("no option is listed twice", dupes.length === 0, dupes.join("; ") || "ok");

  // The list must really take effect in the data the storefront reads.
  const notApplied: string[] = [];
  for (const e of entries) {
    const legacy = legacyBySlug.get(e.slug);
    if (legacy) {
      const v = [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].find((x) => normalizeOption(x.name) === e.option || normalizeOption(x.id) === e.option);
      if (v && v.availability !== "out-of-stock") notApplied.push(`${e.slug} / ${v.name}`);
    } else {
      const p = publishedBySlug.get(e.slug);
      const v = p?.variants.find((x) => normalizeOption(x.label) === e.option || normalizeOption(x.id) === e.option);
      if (v && v.availabilityStatus !== "out-of-stock") notApplied.push(`${e.slug} / ${v.label}`);
    }
  }
  check("every listed option reads out-of-stock in the catalog the storefront uses", notApplied.length === 0, notApplied.join("; ") || "ok");

  // And nothing outside the list is out-of-stock by accident in the legacy catalog — the list is
  // the single place stock is hand-maintained now (owner decision 2026-09-06, Q1 "แบบ 1").
  const listedKeys = new Set(entries.map((e) => `${e.slug}|${e.option}`));
  const stray = catalogIncludingHidden.flatMap((p) =>
    [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])]
      .filter((v) => v.availability === "out-of-stock" && !listedKeys.has(`${p.slug}|${normalizeOption(v.name)}`) && !listedKeys.has(`${p.slug}|${normalizeOption(v.id)}`))
      .map((v) => `${p.slug} / ${v.name}`)
  );
  check("no legacy option is hard-coded out-of-stock outside the list (sold-out.ts is the single source)", stray.length === 0, stray.join("; ") || "ok");

  return results;
}

if (require.main === module) {
  const results = runSoldOutContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} sold-out list checks passed.`);
}
