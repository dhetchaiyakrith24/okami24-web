import "server-only";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { getCompatibleConsumables } from "@/data/catalog-relationships";
import { HOME_TYPE_SECTIONS } from "@/data/home-sections";
import { allCatalogItems, getCatalogItem, type CatalogItem } from "@/lib/catalog-index";
import { inStockEntryKeys } from "@/lib/in-stock";

/**
 * The cart page's "สินค้าที่คุณอาจสนใจ" row (owner queue Q8 "A+B ครึ่ง ๆ", designer spec 26/10): up to SLOTS cards, half
 * picked from what is in the cart (A) and half from the shop's own best-seller list (B); a side short of picks lends its
 * slots to the other. Picked here on the server so the client cart gets only the few small cards (never the catalog).
 *
 * A, per cart line in order — never an invented pairing (BSOT §17): (1) a pod / coil the relationship table verifies for
 * that device (BSOT §14 device → consumable), (2) same brand + category, (3) same category, (4) same brand. A consumable
 * (pod · coil · stick) enters ONLY through (1): the designer review 26/10 caught an M Switch pod offered to an M Bar buyer.
 * B = BSOT §15's list, then the homepage lead models as a reserve so the row is full whenever the shop has stock — used only
 * as an order: the heading claims nothing (owner 20/10: no "best seller" wording, there are no sales figures).
 * Every card: sellable today (the product page's buy rule, in-stock.ts), an approved price, not already in the cart, not
 * on BSOT §15 "Not recommended". Deterministic (no shuffle) — the same cart always shows the same row.
 */
const SLOTS = 4;

/** BSOT §15 in its order — "Real best sellers", "Customer favorites", then "Beginner friendly". Esko Bar Switch 20K = the kit
 *  page (pod-159) · M Switch 15K = the kit page (its "ใช้กับ" section leads to the pods) · nexBar CLEAR 18K (pod-180) ·
 *  "Marbo" = SALTHUB M BAR ("มาโบ") 10K / 9K.
 *  "Relx Connector 20K" is not listed until the owner says which page it means (Muro Connector 20K or RELX Creator Pod 20K). */
const SHOP_PICKS = ["pod-159", "m-switch-kit", "pod-180", "m-bar-10k", "m-bar-9k"];

/** BSOT §15 "Not recommended". */
const NEVER = new Set(["muro-space-15k"]);

/** Parts that fit only some devices (src/data/categories.ts) — offered only where the relationship table verifies the fit. */
const CONSUMABLE_CATEGORIES = new Set(["pods-cartridges", "coils-accessories", "heated-tobacco-consumables"]);

export interface CartSuggestion {
  slug: string;
  href: string;
  name: string;
  image: { src: string; alt: string } | null;
  price: number;
}

function sellable(slug: string): boolean {
  const legacy = getProduct(slug);
  if (legacy) return inStockEntryKeys([legacy], []).length > 0;
  const published = getPublishedProductBySlug(slug);
  return published ? inStockEntryKeys([], [published]).length > 0 : false;
}

/** Homepage lead order first (Friday's flagship picks per type), then by name — a stable order inside each A tier. */
const LEAD = HOME_TYPE_SECTIONS.flatMap((s) => s.first);
function byLead(a: CatalogItem, b: CatalogItem): number {
  const ia = LEAD.indexOf(a.slug);
  const ib = LEAD.indexOf(b.slug);
  if (ia !== ib) return (ia < 0 ? Infinity : ia) - (ib < 0 ? Infinity : ib);
  return a.name.localeCompare(b.name);
}

function toCard(item: CatalogItem): CartSuggestion {
  return { slug: item.slug, href: item.href, name: item.name, image: item.image, price: item.sellingPrice as number };
}

export function cartSuggestions(cartSlugs: string[]): CartSuggestion[] {
  const taken = new Set(cartSlugs);
  const ok = (item: CatalogItem | undefined): item is CatalogItem =>
    item !== undefined && !taken.has(item.slug) && !NEVER.has(item.slug) && item.sellingPrice !== null && sellable(item.slug);
  const openFit = (item: CatalogItem) => !CONSUMABLE_CATEGORIES.has(item.categoryId);

  const catalog = allCatalogItems();
  const fromCart: CatalogItem[] = [];
  for (const slug of cartSlugs) {
    const own = getCatalogItem(slug);
    if (!own) continue;
    const tiers: CatalogItem[][] = [
      getCompatibleConsumables(slug).map((c) => getCatalogItem(c.ref.slug)).filter(ok).sort(byLead),
      catalog.filter((i) => own.brandId !== null && i.brandId === own.brandId && i.categoryId === own.categoryId).filter(openFit).filter(ok).sort(byLead),
      catalog.filter((i) => i.categoryId === own.categoryId).filter(openFit).filter(ok).sort(byLead),
      catalog.filter((i) => own.brandId !== null && i.brandId === own.brandId).filter(openFit).filter(ok).sort(byLead),
    ];
    for (const tier of tiers) for (const item of tier) if (!fromCart.some((x) => x.slug === item.slug)) fromCart.push(item);
  }
  const picks = [...new Set([...SHOP_PICKS, ...LEAD])].map((slug) => getCatalogItem(slug)).filter(ok).filter(openFit);

  // Half and half; a short side lends its slots to the other (and a product in both halves counts once).
  const aCount = Math.min(fromCart.length, Math.max(SLOTS / 2, SLOTS - picks.length));
  const a = fromCart.slice(0, aCount);
  const b = picks.filter((i) => !a.some((x) => x.slug === i.slug)).slice(0, SLOTS - a.length);
  const rest = fromCart.slice(aCount).filter((i) => !b.some((x) => x.slug === i.slug));
  const chosen = [...a, ...b, ...rest].slice(0, SLOTS);
  // 2–3 cards = show 2, fewer = none (no hole in the 2 × 2 phone grid — designer spec).
  const shown = chosen.length >= SLOTS ? SLOTS : chosen.length >= 2 ? 2 : 0;
  return chosen.slice(0, shown).map(toCard);
}
