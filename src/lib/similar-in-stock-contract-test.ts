/**
 * The "similar models we have" block on a no-price page (round popular models 07/11). Run: npx tsx src/lib/similar-in-stock-contract-test.ts
 * A page with nothing to buy must never point at something else with nothing to buy, or at a model the shop will not recommend.
 */
import { allProducts } from "@/data/products";
import { IN_STOCK_ALTERNATIVES, NEVER_SUGGEST } from "@/data/similar-models";
import { getLegacyApprovedPrice } from "@/data/shipnity-seed/legacy-price-approvals";
import { getCatalogItem } from "@/lib/catalog-index";
import { inStockEntryKeys } from "@/lib/in-stock";
import { similarInStock } from "@/lib/similar-in-stock";

const fails: string[] = [];
for (const [page, picks] of Object.entries(IN_STOCK_ALTERNATIVES)) {
  if (!getCatalogItem(page)) fails.push(`${page}: page in IN_STOCK_ALTERNATIVES does not exist`);
  for (const pick of picks) if (!getCatalogItem(pick)) fails.push(`${page}: pick ${pick} does not exist`);
}
let pages = 0;
for (const p of allProducts) {
  if (getLegacyApprovedPrice(p.slug) !== null || p.hiddenFromStorefront) continue;
  pages++;
  const items = similarInStock(p.slug);
  if (items.length === 0) fails.push(`${p.slug}: no-price page offers nothing`);
  for (const item of items) {
    if (item.slug === p.slug) fails.push(`${p.slug}: offers itself`);
    if (NEVER_SUGGEST.has(item.slug)) fails.push(`${p.slug}: offers ${item.slug}, never suggested`);
    if (getCatalogItem(item.slug)?.sellingPrice == null) fails.push(`${p.slug}: offers ${item.slug}, no price`);
    const keys = inStockEntryKeys(item.legacy ? [item.legacy] : [], item.published ? [item.published] : []);
    if (keys.length === 0) fails.push(`${p.slug}: offers ${item.slug}, not buyable`);
  }
}
if (fails.length > 0) {
  console.error(fails.join("\n"));
  process.exit(1);
}
console.log(`similar-in-stock contract: PASS (${pages} no-price pages)`);
