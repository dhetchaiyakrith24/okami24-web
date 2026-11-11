/**
 * T2-31 — src/data/fits-devices.ts: every row names a real, visible consumable; the names are non-empty and unique; the
 * source is the maker's own https page with a read date; and no plain name repeats a device the shop sells and already
 * links for that part (a device the shop sells must be a cited edge in catalog-relationships.ts, not plain text).
 * Run: npx tsx src/data/fits-devices-contract-test.ts
 */
import { FITS_DEVICES, fitsDeviceNames } from "./fits-devices";
import { getCompatibleDevices, resolveVisibleRef } from "./catalog-relationships";
import { allProducts } from "@/data/products";
import { projectActiveCatalog } from "@/data/shipnity-seed/active-catalog-to-product-master";

export function runFitsDevicesContractTests() {
  const results: { name: string; passed: boolean; detail: string }[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
  // Every device the shop lists (any state) by its model words — a plain name that matches one should be an edge instead.
  const key = (s: string) => s.toLowerCase().replace(/[\s-]+/g, "");
  const shopDevices = new Map<string, string>();
  for (const p of allProducts) shopDevices.set(key(p.name.replace(/^\S+\s+/, "")), p.slug);
  for (const r of projectActiveCatalog().filter((x) => x.status === "candidate")) shopDevices.set(key(r.product.displayName.replace(/^\S+\s+/, "")), r.product.slug);

  for (const [slug, row] of Object.entries(FITS_DEVICES)) {
    check(`${slug}: is a visible catalog product`, !!resolveVisibleRef(slug));
    check(`${slug}: names are non-empty and unique`, row.names.length > 0 && new Set(row.names.map(key)).size === row.names.length, row.names.join(", "));
    check(`${slug}: source is an https page with a read date`, row.sourceUrls.length > 0 && row.sourceUrls.every((u) => /^https:\/\//.test(u)) &&/^\d{4}-\d{2}-\d{2}$/.test(row.read) && row.evidence.length > 0, row.sourceUrls.join(" "));
    const linked = getCompatibleDevices(slug).map((d) => key(d.ref.name.replace(/^S+s+/, "")));
    const repeats = row.names.filter((n) => linked.includes(key(n)));
    check(`${slug}: no plain name repeats a linked device`, repeats.length === 0 && fitsDeviceNames(slug, []).length === row.names.length, repeats.join(", "));
    const sold = row.names.filter((n) => shopDevices.has(key(n)));
    check(`${slug}: no plain name is a device the shop lists (that needs a cited edge)`, sold.length === 0, sold.map((n) => `${n} → ${shopDevices.get(key(n))}`).join(", "));
  }
  return results;
}

if (require.main === module) {
  const results = runFitsDevicesContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
