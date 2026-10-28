import "server-only";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getCompatibleConsumables, getCompatibleDevices } from "@/data/catalog-relationships";
import { HOME_TYPE_SECTIONS } from "@/data/home-sections";
import { allCatalogItems, getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { inStockEntryKeys } from "@/lib/in-stock";
import { resolveProductRef } from "./catalog-resolver";

/**
 * The cart page's "สินค้าที่คุณอาจสนใจ" row. Picked here on the server so the client cart gets only the few small cards
 * (never the catalog).
 *
 * Cart with items (owner 28/10: "เอาให้คล้าย 50 อีก 50 แนะนำอื่นๆได้" — 26/10's fits-only row came out too thin, or all
 * e-liquid for a refillable device, and a disposable has nothing that fits). Half the row is LIKE the cart, half the shop's picks:
 *   like the cart, taken in turns across the cart lines (one card per line per turn, so every line shows; tiers 1–4 of
 *   every line before any tier 5) — what fits it first, never an invented pairing (BSOT §17):
 *     (1) the pods / coils / sticks the relationship table verifies for that device (BSOT §14 device → consumable),
 *     (2) the device a pod / coil / stick in the cart is verified to fit (the derived reverse of the same table),
 *     (3) one e-liquid when the line is a refillable device (category pod-systems = fill-your-own, src/data/categories.ts),
 *     then (4) the same brand in the same category, (5) the same category — "like it", claimed as nothing more;
 *   the other half: SHOP_PICKS then the homepage lead models, devices only (as the empty cart).
 * Either half short = the other fills in. The like-the-cart cards come first.
 *
 * Empty cart: SHOP_PICKS (market order, below), then the homepage lead models as a reserve — used only as an order: the heading claims
 * nothing (owner 20/10: no "best seller" wording, there are no sales figures).
 * Every card: sellable today (the product page's buy rule, in-stock.ts), an approved price, not already in the cart, not
 * on BSOT §15 "Not recommended". Deterministic (no shuffle) — the same cart always shows the same row.
 */
/** Up to 8 cards (owner 27/10: "เพิ่มการ์ดจาก 4 เป็น 8 บนมือถือให้ปัดด้วยนิ้วขวาซ้ายได้") — phones swipe one row, ≥640 shows rows of 4. */
const SLOTS = 8;
const ROW = 4;

/** Market order (owner 26/10: "ยึดจากแหล่งตลาด ใช้การคาดเดาได้ — เฉพาะเรื่องนี้"). ESTIMATE, not sales figures: researcher 27/10
 *  counted Thai vape shops' own "สินค้าขายดี / ยอดนิยม" blocks (pod789.com · ihavevape.net · vapemun.com · 17pod.shop ·
 *  pod9k.com · zeedcupvp.com · goatvapethai.com; the first three look like one template, so not independent), weighted by
 *  position. Strong (4–5 shops): M BAR 10K · ESKO BAR SWITCH 20K kit (pod-159) · M SWITCH kit · M BAR 9K — the same four the
 *  owner's BSOT §15 names. Medium (2–3 shops): Muro Connector 20K — also the owner's "Relx Connector 20K" [estimate: the only
 *  "Connector" in Thai shops; pod789 sells it as a pod that fits the RELX Creator] · ESKO BAR 20000 · INFY 20K · RELX LUMI 18K.
 *  nexBar CLEAR 18K (pod-180) had no market signal; it stays last on the owner's word (BSOT §15 "Customer favorites"). */
const SHOP_PICKS = ["m-bar-10k", "pod-159", "m-switch-kit", "m-bar-9k", "muro-connector-20k", "esko-bar-20k", "infy-20k", "relx-lumi-18k", "pod-180"];

/** BSOT §15 "Not recommended" + the one lookalike (owner 27/10, HANDOFF §18: never in cart suggestions or shop picks). */
const NEVER = new Set(["muro-space-15k", "marbo-10k-clone"]);

/** Parts that fit only some devices (src/data/categories.ts) — never a shop pick for an empty cart. */
const CONSUMABLE_CATEGORIES = new Set(["pods-cartridges", "coils-accessories", "heated-tobacco-consumables"]);

/** Fill-your-own devices (categories.ts: refillable VOOPOO joined pod-systems; switch-pods are prefilled, never filled). */
const REFILLABLE_CATEGORY = "pod-systems";
const E_LIQUID_CATEGORY = "e-liquid";

/** One colour / flavour / variant of a suggestion, for the card's quick add (owner 26/10: "กดตะกร้าปุ๊บก็มีสีให้เลือกเลย"). */
export interface SuggestionOption {
  id: string;
  name: string;
  image?: { src: string; alt: string };
  swatchHex?: string;
  /** false = the add would be refused (resolveProductRef — the same rule addToCart applies). */
  sellable: boolean;
}

export interface CartSuggestion {
  slug: string;
  href: string;
  name: string;
  image: { src: string; alt: string } | null;
  price: number;
  /** Which word heads the picker: a legacy colour or flavour list, or a ProductMaster variant list (no axis word). */
  axis: "color" | "flavor" | null;
  /** [] = no options: one tap adds the product itself. */
  options: SuggestionOption[];
}

function sellable(slug: string): boolean {
  const legacy = getProduct(slug);
  if (legacy) return inStockEntryKeys([legacy], []).length > 0;
  const published = getPublishedProductBySlug(slug);
  return published ? inStockEntryKeys([], [published]).length > 0 : false;
}

/** Homepage lead order first (Friday's flagship picks per type), then by name — a stable order inside each tier. */
const LEAD = HOME_TYPE_SECTIONS.flatMap((s) => s.first);
function byLead(a: CatalogItem, b: CatalogItem): number {
  const ia = LEAD.indexOf(a.slug);
  const ib = LEAD.indexOf(b.slug);
  if (ia !== ib) return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib);
  return a.name.localeCompare(b.name);
}

function optionsOf(item: CatalogItem): Pick<CartSuggestion, "axis" | "options"> {
  const can = (variantId: string) => resolveProductRef({ origin: item.origin, slug: item.slug, variantId }).ok;
  const legacy = getProduct(item.slug);
  if (legacy) {
    const colors = legacy.colorVariants ?? [];
    const list = [...colors, ...(legacy.flavorVariants ?? [])];
    return {
      axis: list.length === 0 ? null : colors.length > 0 ? "color" : "flavor",
      options: list.map((v) => ({ id: v.id, name: v.name, image: v.image, swatchHex: v.swatchHex, sellable: can(v.id) })),
    };
  }
  const published = getPublishedProductBySlug(item.slug);
  return {
    axis: null,
    options: (published?.variants ?? []).map((v) => ({ id: v.id, name: v.label, image: v.image ? { src: v.image.src, alt: v.image.alt } : undefined, sellable: can(v.id) })),
  };
}

function toCard(item: CatalogItem): CartSuggestion {
  return { slug: item.slug, href: item.href, name: item.name, image: item.image, price: item.sellingPrice as number, ...optionsOf(item) };
}

/** What is like one cart line, in tier order (see the file header): `close` = what fits it (1–3) and its own brand in its
 *  category (4); `loose` = the rest of its category (5), which only says "the same kind of thing". */
function likeFor(slug: string, catalog: CatalogItem[]): { close: CatalogItem[]; loose: CatalogItem[] } {
  const own = getCatalogItem(slug);
  if (!own) return { close: [], loose: [] };
  const bySlug = (slugs: string[]) => slugs.map((s) => getCatalogItem(s)).filter((i): i is CatalogItem => i !== undefined).sort(byLead);
  const sameCategory = catalog.filter((i) => i.categoryId === own.categoryId).sort(byLead);
  return {
    close: [
      ...bySlug(getCompatibleConsumables(slug).map((c) => c.ref.slug)),
      ...bySlug(getCompatibleDevices(slug).map((d) => d.ref.slug)),
      // one e-liquid only: the half is 4 cards, and a refillable device's row was all e-liquid before (owner 28/10)
      ...(own.categoryId === REFILLABLE_CATEGORY ? catalog.filter((i) => i.categoryId === E_LIQUID_CATEGORY && sellable(i.slug)).sort(byLead).slice(0, 1) : []),
      ...(own.brandId ? sameCategory.filter((i) => i.brandId === own.brandId) : []),
    ],
    loose: sameCategory,
  };
}

/** Take one card per list in turn (cart order) until every list is used up — so the second and third cart lines get
 *  their own cards instead of the first line filling the whole half (checker #960). */
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

/** Heat-not-burn and vapour are different shoppers: the "other" half shows the cart's own family first (checker #960 —
 *  a vape cart got three IQOS devices when the vape picks were sold out); at most ONE card of the other family, and the
 *  like-the-cart half fills the rest. */
const HEATED_TOBACCO = new Set(["heated-tobacco-devices", "heated-tobacco-consumables"]);
const isHeated = (i: CatalogItem) => HEATED_TOBACCO.has(i.categoryId);

export function cartSuggestions(cartSlugs: string[]): CartSuggestion[] {
  const taken = new Set(cartSlugs);
  const ok = (item: CatalogItem | undefined): item is CatalogItem =>
    item !== undefined && !taken.has(item.slug) && !NEVER.has(item.slug) && item.sellingPrice !== null && sellable(item.slug);
  const picks = () => [...new Set([...SHOP_PICKS, ...LEAD])].map((slug) => getCatalogItem(slug)).filter(ok).filter((i) => !CONSUMABLE_CATEGORIES.has(i.categoryId));

  let chosen: CatalogItem[] = [];
  if (cartSlugs.length > 0) {
    const catalog = allCatalogItems();
    const lines = cartSlugs.map((slug) => likeFor(slug, catalog));
    const like: CatalogItem[] = [];
    roundRobin(lines.map((l) => l.close.filter(ok)), like);
    roundRobin(lines.map((l) => l.loose.filter(ok)), like);
    const heatedCart = cartSlugs.some((slug) => {
      const own = getCatalogItem(slug);
      return own !== undefined && isHeated(own);
    });
    const rest = picks().filter((i) => !like.some((x) => x.slug === i.slug));
    const other = [...rest.filter((i) => isHeated(i) === heatedCart), ...rest.filter((i) => isHeated(i) !== heatedCart).slice(0, 1)];
    const half = SLOTS / 2;
    const likeCount = Math.min(like.length, Math.max(half, SLOTS - other.length));
    const otherCount = Math.min(other.length, SLOTS - likeCount);
    chosen = [...like.slice(0, likeCount), ...other.slice(0, otherCount)];
  } else {
    chosen = picks();
  }
  // Phones swipe a single row, so any count fits there; from 640 px the cards sit in rows of 4, so 5–7 round down to 4
  // (no half-empty second row). Fewer than 4 all show — a single fitting part still shows (cart fit 27/10).
  const shown = chosen.length >= SLOTS ? SLOTS : chosen.length >= ROW ? ROW : chosen.length;
  return chosen.slice(0, shown).map(toCard);
}
