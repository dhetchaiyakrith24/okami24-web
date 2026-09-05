/**
 * Read-only storefront census for status reports:
 *   npx tsx scripts/count-storefront.ts
 * Prints how many products the storefront shows, how many are purchasable, and how many
 * legacy products still have no approved price. No writes, no side effects.
 */
import { catalogIncludingHidden } from "../src/data/products";
import { LEGACY_APPROVED_PRICING } from "../src/data/shipnity-seed/legacy-price-approvals";
import { getPublishedProducts } from "../src/data/shipnity-seed/storefront-bridge";

const hidden = catalogIncludingHidden.filter((p) => p.hiddenFromStorefront);
const legacyShown = catalogIncludingHidden.filter((p) => !p.hiddenFromStorefront);
const legacyPriced = legacyShown.filter((p) => p.slug in LEGACY_APPROVED_PRICING);
const legacyUnpriced = legacyShown.filter((p) => !(p.slug in LEGACY_APPROVED_PRICING));
const productMaster = getPublishedProducts();

console.log(`legacy total (incl. hidden): ${catalogIncludingHidden.length}`);
console.log(`legacy hidden from storefront: ${hidden.length} -> ${hidden.map((p) => p.slug).join(", ")}`);
console.log(`legacy shown: ${legacyShown.length}`);
console.log(`  with approved price (buyable): ${legacyPriced.length}`);
console.log(`  without price (view only): ${legacyUnpriced.length}`);
console.log(`ProductMaster published: ${productMaster.length}`);
console.log(`STOREFRONT TOTAL shown: ${legacyShown.length + productMaster.length}`);
console.log(`STOREFRONT buyable: ${legacyPriced.length + productMaster.length}`);
