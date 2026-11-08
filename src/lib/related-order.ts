import { getProduct, getRelatedProducts } from "@/data/products";
import { kindCategoryId } from "@/data/categories";
import { getPublishedProductBySlug, type StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { HOME_TYPE_SECTIONS } from "@/data/home-sections";
import { NEVER_BESIDE, NEVER_SUGGEST } from "@/data/similar-models";
import { allCatalogItems, getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { RELATED_SLOTS } from "@/lib/related-row";
import { legacyCardStock, publishedCardStock } from "@/lib/stock/card-stock";
import type { LiveLookup } from "@/lib/stock/live-rules";
import type { Product } from "@/types/catalog";
import { taglineThFor } from "@/lib/card-taglines";

/**
 * What the shop suggests beside a product, best first — one order for the cart's "สินค้าที่คุณอาจสนใจ" row and the product
 * page's "สินค้าใกล้เคียง" block. Owner 07/11 (replaces 28/10's half-and-half): four tiers, and a later tier takes a seat only
 * after the earlier ones are used up, so a customer always sees tiers 1–2 complete first.
 *   1 near or used together: what the relationship table verifies, both ways (BSOT §14 device → consumable, never an invented
 *     pairing, BSOT §17) + two e-liquids for a refillable device (category pod-systems = fill-your-own, src/data/categories.ts),
 *     taken in turns so both reach the first seats ("ลูกค้าเลือก Argus g4 สินค้าใกล้เคียงต้องมี Coil - น้ำยา");
 *   2 the same category, its own brand (and a legacy product's hand-picked list) — "แนะนำในหมวดเดียวกัน";
 *   3 other choices: more e-liquid for a refillable device ("น้ำยาอื่นๆ");
 *   4 the other models of that category, then disposables, the shop's picks first ("ถ้ามี Pod system ตัวอื่นก็แนะนำเพิ่มได้ ไม่ก็ดัน
 *     พอตใช้แล้วทิ้งแทน"): real disposables, not whatever else the picks hold. A heat-not-burn shopper gets the heated picks instead.
 * Tiers 2 and 4 both read "same category": the brand is what tells them apart, so no card can sit in both.
 * Parts: a pod / coil of another make, or one with no verified fit for a device in the cart, is never offered (a part that
 * does not fit is the one wrong suggestion that costs the customer money). Fit data missing = the part is left out, not guessed.
 * Stock: `rowFor` is the one row for both places, so the same stock gives the same cards. The server passes the warehouse's live
 * lookup; only the prerendered page's first paint uses the build (no lookup), and /api/related/<slug> replaces it after load.
 */

/** Market order (owner 26/10: "ยึดจากแหล่งตลาด ใช้การคาดเดาได้ — เฉพาะเรื่องนี้"). ESTIMATE, not sales figures: researcher 27/10
 *  counted Thai vape shops' own "สินค้าขายดี / ยอดนิยม" blocks (pod789.com · ihavevape.net · vapemun.com · 17pod.shop ·
 *  pod9k.com · zeedcupvp.com · goatvapethai.com; the first three look like one template, so not independent), weighted by
 *  position. Strong (4–5 shops): M BAR 10K · ESKO BAR SWITCH 20K kit (pod-159) · M SWITCH kit · M BAR 9K — the same four the
 *  owner's BSOT §15 names. Medium (2–3 shops): Muro Connector 20K — also the owner's "Relx Connector 20K" [estimate: the only
 *  "Connector" in Thai shops; pod789 sells it as a pod that fits the RELX Creator] · ESKO BAR 20000 · INFY 20K · RELX LUMI 18K.
 *  nexBar CLEAR 18K (pod-180) had no market signal; it stays last on the owner's word (BSOT §15 "Customer favorites"). */
const SHOP_PICKS = ["m-bar-10k", "pod-159", "m-switch-kit", "m-bar-9k", "muro-connector-20k", "esko-bar-20k", "infy-20k", "relx-lumi-18k", "pod-180"];

/** Parts that fit only some devices (src/data/categories.ts) — never a shop pick for an empty cart. */
const CONSUMABLE_CATEGORIES = new Set(["pods-cartridges", "coils-accessories", "heated-tobacco-consumables"]);

/** Fill-your-own devices (categories.ts: refillable VOOPOO joined pod-systems; switch-pods are prefilled, never filled). */
const REFILLABLE_CATEGORY = "pod-systems";
const E_LIQUID_CATEGORY = "e-liquid";
const DISPOSABLES = "disposables";
/** E-liquids in tier 1 and in tier 3: two each, so a refillable device's row is never all e-liquid (owner 28/10). */
const LIKE_LIQUIDS = 2;
const MORE_LIQUIDS = 2;

/** Heat-not-burn and vapour are different shoppers (checker #960 — a vape cart got three IQOS devices when the vape picks
 *  were sold out): a vape row never gets a heated card from tier 4, a heated row at most one disposable. */
const HEATED_TOBACCO = new Set(["heated-tobacco-devices", "heated-tobacco-consumables"]);
const isHeated = (i: CatalogItem) => HEATED_TOBACCO.has(i.categoryId);
const isPart = (i: CatalogItem) => CONSUMABLE_CATEGORIES.has(kindCategoryId(i));

/** Homepage lead order first (Friday's flagship picks per type), then by name — a stable order inside each tier. */
const LEAD = HOME_TYPE_SECTIONS.flatMap((s) => s.first);
function byLead(a: CatalogItem, b: CatalogItem): number {
  const ia = LEAD.indexOf(a.slug);
  const ib = LEAD.indexOf(b.slug);
  if (ia !== ib) return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib);
  return a.name.localeCompare(b.name);
}

/** Two lists in turns: a, b, a, b … then what is left of the longer one. */
function inTurns(a: CatalogItem[], b: CatalogItem[]): CatalogItem[] {
  const out: CatalogItem[] = [];
  for (let n = 0; n < Math.max(a.length, b.length); n++) {
    if (n < a.length) out.push(a[n]);
    if (n < b.length) out.push(b[n]);
  }
  return out;
}

/** Take one card per list in turn (cart order) until every list is used up — so the second and third cart lines get
 *  their own cards instead of the first line filling the tier (checker #960). */
function roundRobin(lists: CatalogItem[][], into: CatalogItem[]): void {
  const at = lists.map(() => 0);
  for (let more = true; more; ) {
    more = false;
    lists.forEach((list, n) => {
      while (at[n] < list.length && into.some((x) => x.slug === list[at[n]].slug)) at[n]++;
      if (at[n] < list.length) {
        into.push(list[at[n]++]);
        more = true;
      }
    });
  }
}

interface Tiers {
  fits: CatalogItem[];
  brand: CatalogItem[];
  moreLiquids: CatalogItem[];
  rest: CatalogItem[];
}

/** The tiers of one product (see the file header), keeping only what `ok` lets through. */
function tiersOf(slug: string, catalog: CatalogItem[], ok: (item: CatalogItem) => boolean): Tiers {
  const own = getCatalogItem(slug);
  if (!own) return { fits: [], brand: [], moreLiquids: [], rest: [] };
  const bySlug = (slugs: string[]) =>
    slugs
      .map((s) => getCatalogItem(s))
      .filter((i): i is CatalogItem => i !== undefined && ok(i))
      .sort(byLead);
  // kind, not listing: a prefilled pod listed beside the switch devices (owner 02/11) is still a part, not a device.
  const kind = kindCategoryId(own);
  const sameCategory = catalog.filter((i) => kindCategoryId(i) === kind && ok(i)).sort(byLead);
  const verified = [...bySlug(getCompatibleConsumables(slug).map((c) => c.ref.slug)), ...bySlug(getCompatibleDevices(slug).map((d) => d.ref.slug))];
  const liquids = own.categoryId === REFILLABLE_CATEGORY ? catalog.filter((i) => i.categoryId === E_LIQUID_CATEGORY && ok(i)).sort(byLead) : [];
  return {
    fits: inTurns(verified, liquids.slice(0, LIKE_LIQUIDS)),
    brand: own.brandId ? sameCategory.filter((i) => i.brandId === own.brandId) : [],
    moreLiquids: liquids.slice(LIKE_LIQUIDS, LIKE_LIQUIDS + MORE_LIQUIDS),
    // A pod / coil / stick of another make fits other devices — shown beside a device it reads as a spare for it (checker #960).
    rest: isPart(own) ? [] : sameCategory,
  };
}

/** The shop's picks, devices only (market order, above; the homepage lead models as a reserve — used only as an order: no
 *  heading claims anything, owner 20/10: no "best seller" wording, there are no sales figures). */
function shopPicks(ok: (item: CatalogItem) => boolean): CatalogItem[] {
  return [...new Set([...SHOP_PICKS, ...LEAD])]
    .map((slug) => getCatalogItem(slug))
    .filter((i): i is CatalogItem => i !== undefined && ok(i))
    .filter((i) => !isPart(i));
}

/** The whole suggestion order for these products (one: a product page · several: the cart's lines · none: the empty cart,
 *  the shop's picks alone). Tier by tier; inside a tier the lines take turns. */
export function suggestionOrder(slugs: string[], ok: (item: CatalogItem) => boolean): CatalogItem[] {
  if (slugs.length === 0) return shopPicks(ok);
  const catalog = allCatalogItems();
  const own = slugs.map((s) => getCatalogItem(s)).filter((i): i is CatalogItem => i !== undefined);
  const lines = slugs.map((s) => tiersOf(s, catalog, ok));
  const devices = new Set(own.filter((i) => !isPart(i)).map((i) => i.slug));
  // With a device in the list, a part of the same make may still not fit it: only a verified fit stays.
  const fitsDevices = (i: CatalogItem) => !isPart(i) || devices.size === 0 || getCompatibleDevices(i.slug).some((d) => devices.has(d.ref.slug));
  const hand = slugs
    .flatMap((s) => {
      const legacy = getProduct(s);
      return legacy ? getRelatedProducts(legacy).map((p) => p.slug) : [];
    })
    .map((s) => getCatalogItem(s))
    .filter((i): i is CatalogItem => i !== undefined && ok(i));
  const heated = own.some(isHeated);
  const picks = shopPicks(ok);
  const disposables = [...picks, ...catalog.filter(ok).sort(byLead)].filter((i) => kindCategoryId(i) === DISPOSABLES);
  const row: CatalogItem[] = [];
  roundRobin(lines.map((l) => l.fits), row);
  roundRobin([...lines.map((l) => l.brand.filter(fitsDevices)), hand.filter(fitsDevices)], row);
  roundRobin(lines.map((l) => l.moreLiquids), row);
  roundRobin(lines.map((l) => l.rest), row);
  roundRobin([heated ? [...picks.filter(isHeated), ...disposables.slice(0, 1)] : disposables], row);
  return row;
}

/** Can a customer buy this now: the rule behind the buy button and the cards' stock (src/lib/stock/card-stock.ts), live when
 *  `live` is given, as built when it is not. */
function canSell(slug: string, live?: LiveLookup): boolean {
  const legacy = getProduct(slug);
  if (legacy) return legacyCardStock(legacy, live).inStock;
  const published = getPublishedProductBySlug(slug);
  return published ? publishedCardStock(published, live).inStock : false;
}

/** The row for these products: the cart's lines, or one product on its page. Every card can be bought (owner 07/11:
 *  "ต้องเป็นสินค้าที่มีในสต๊อกเท่านั้น … Auto ตลอด"), has an approved price, is not one of `slugs` and not on the "never" list. */
export function rowFor(slugs: string[], live?: LiveLookup): CatalogItem[] {
  const taken = new Set(slugs);
  const apart = new Set(slugs.flatMap((s) => NEVER_BESIDE[s] ?? []));
  return suggestionOrder(slugs, (i) => !taken.has(i.slug) && !apart.has(i.slug) && !NEVER_SUGGEST.has(i.slug) && i.sellingPrice !== null && canSell(i.slug, live)).slice(0, RELATED_SLOTS);
}

/** One card of the product page's block: the shop's own card data. */
export interface RelatedItem {
  slug: string;
  legacy?: Product;
  /** The legacy card's Thai tagline (card-taglines.ts), so the client card needs no copy table. */
  taglineTh?: string;
  published?: StorefrontProductView;
  /** As built: what a page that never asks the server starts from (guide and technology pages). */
  inStock: boolean;
}

/** What ProductCard does not read: the text of the product's own page. The block's cards reach the browser in every
 *  product page, and these fields were most of their weight. */
const cardOnly = (p: Product): Product => ({ ...p, features: [], faqs: [], compatibility: [], sourceUrls: [] });

function relatedItem(slug: string): RelatedItem | null {
  const legacy = getProduct(slug);
  if (legacy) return { slug, legacy: cardOnly(legacy), taglineTh: taglineThFor(slug), inStock: legacyCardStock(legacy).inStock };
  const published = getPublishedProductBySlug(slug);
  return published ? { slug, published, inStock: publishedCardStock(published).inStock } : null;
}

/** A list of legacy products as the block's cards (guides and technology pages: the products the page itself names). */
export const legacyRelatedItems = (products: Product[]): RelatedItem[] =>
  products.map((p) => ({ slug: p.slug, legacy: cardOnly(p), taglineTh: taglineThFor(p.slug), inStock: legacyCardStock(p).inStock }));

/** The same for the dev-only pilot products. */
export const publishedRelatedItems = (products: StorefrontProductView[]): RelatedItem[] =>
  products.map((p) => ({ slug: p.slug, published: p, inStock: publishedCardStock(p).inStock }));

/** The product page's block: the same row as a cart holding this one product, with its card data. The page ships only the
 *  build's row, so its weight stays at eight cards; a card the build could not offer arrives from /api/related when it is needed. */
export function relatedFor(slug: string, live?: LiveLookup): RelatedItem[] {
  return rowFor([slug], live)
    .map((i) => relatedItem(i.slug))
    .filter((i): i is RelatedItem => i !== null);
}
