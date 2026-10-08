/**
 * Contract tests for the website → Shipnity SKU map (sku-map.ts): every storefront product and every one of its options has
 * exactly one entry, codes look like Shipnity codes, no code is claimed by two options, and "no SKU" really reads
 * out-of-stock in the catalog the storefront uses. Discovered and run by scripts/verify-catalog.ts.
 */
import { SHIPNITY_SKU_MAP } from "./sku-map";
import { allProducts } from "@/data/products";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";

export interface SkuMapContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const CODE = /^[A-Za-z]+(-[A-Za-z]+)?-\d+(-\d+)*$/;

export function runSkuMapContractTests(): SkuMapContractResult[] {
  const results: SkuMapContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const shown = [
    ...allProducts.map((p) => ({ slug: p.slug, ids: [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].map((v) => v.id) })),
    ...buildPublishedCatalog().map((p) => ({ slug: p.slug, ids: p.variants.map((v) => v.id) })),
  ];

  const missing: string[] = [];
  const shape: string[] = [];
  for (const p of shown) {
    const e = SHIPNITY_SKU_MAP[p.slug];
    if (!e) { missing.push(p.slug); continue; }
    if (p.ids.length === 0) {
      if (e.options !== undefined || !("product" in e)) shape.push(`${p.slug}: no options on the site → needs \`product\``);
      continue;
    }
    if (!e.options) { shape.push(`${p.slug}: has options on the site → needs \`options\``); continue; }
    for (const id of p.ids) if (!(id in e.options)) missing.push(`${p.slug} / ${id}`);
    for (const id of Object.keys(e.options)) if (!p.ids.includes(id)) shape.push(`${p.slug} / ${id}: not an option on the site`);
  }
  check("every storefront product and option has an entry", missing.length === 0, missing.join("; ") || `${shown.length} products`);
  check("entry shape matches the site (options vs product, no stray keys)", shape.length === 0, shape.join("; ") || "ok");

  const shownSlugs = new Set(shown.map((p) => p.slug));
  const extra = Object.keys(SHIPNITY_SKU_MAP).filter((s) => !shownSlugs.has(s));
  check("no entry for a product the storefront does not show", extra.length === 0, extra.join("; ") || "ok");

  const values = Object.entries(SHIPNITY_SKU_MAP).flatMap(([slug, e]) =>
    e.options ? Object.entries(e.options).map(([id, v]) => ({ where: `${slug} / ${id}`, v })) : [{ where: slug, v: e.product }]
  );
  const badCode = values.filter((x) => typeof x.v === "string" && x.v !== "check" && !CODE.test(x.v)).map((x) => `${x.where}: ${x.v}`);
  check("every code looks like a Shipnity code", badCode.length === 0, badCode.join("; ") || `${values.length} values`);

  const seen = new Map<string, string>();
  const dup: string[] = [];
  for (const x of values) {
    if (typeof x.v !== "string" || x.v === "check") continue;
    if (seen.has(x.v)) dup.push(`${x.v}: ${seen.get(x.v)} + ${x.where}`);
    else seen.set(x.v, x.where);
  }
  check("no Shipnity code is claimed by two options", dup.length === 0, dup.join("; ") || "ok");

  const legacy = new Map(allProducts.map((p) => [p.slug, p]));
  const published = new Map(buildPublishedCatalog().map((p) => [p.slug, p]));
  const notApplied: string[] = [];
  for (const [slug, e] of Object.entries(SHIPNITY_SKU_MAP)) {
    const l = legacy.get(slug);
    const pm = published.get(slug);
    if (e.options) {
      for (const [id, v] of Object.entries(e.options)) {
        if (v !== null) continue;
        const opt = l ? [...(l.colorVariants ?? []), ...(l.flavorVariants ?? [])].find((o) => o.id === id)?.availability : pm?.variants.find((o) => o.id === id)?.availabilityStatus;
        if (opt !== "out-of-stock") notApplied.push(`${slug} / ${id}`);
      }
    } else if (e.product === null && ((pm && pm.availabilityStatus !== "out-of-stock") || (l && l.availability !== "out-of-stock"))) notApplied.push(slug);
  }
  check("every \"no SKU\" option reads out-of-stock where the storefront reads it", notApplied.length === 0, notApplied.join("; ") || "ok");

  return results;
}

if (require.main === module) {
  const results = runSkuMapContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} SKU map checks passed.`);
}
