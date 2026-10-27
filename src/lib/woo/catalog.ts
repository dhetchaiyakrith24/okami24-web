import { allProducts } from "@/data/products";
import { buildPublishedCatalog } from "@/data/shipnity-seed/storefront-preview-read-model";
import { SHIPNITY_SKU_MAP, type SkuValue } from "@/data/stock/sku-map";

/**
 * The shop's catalog as a WooCommerce store would list it (Shipnity link step 1, owner 27/10) — what Shipnity reads to
 * match its codes to the shop's products ("ตั้ง SKU ให้ตรงกับรหัสสินค้าใน Shipnity", blog.shipnity.com Woo guide).
 *
 *   - Only options with a real warehouse code are listed (sku-map.ts: a code, not null / "check") — the warehouse has
 *     nothing to say about the rest.
 *   - A product with options = `variable` with one variation per coded option; a product without = `simple`.
 *   - `sku` = the Shipnity Max code. No price is sent: prices are the owner's (BSOT §5) and Shipnity does not need them.
 *   - Ids are numbers derived from the slug / option id (FNV-1a), so they stay the same across builds and restarts;
 *     woo-catalog-contract-test.ts fails on a collision.
 * Pure (no database): the route adds the last stock number Shipnity reported on top.
 */

export interface WooVariation {
  id: number;
  parentId: number;
  sku: string;
  optionName: string;
  inStock: boolean;
}

export interface WooProduct {
  id: number;
  slug: string;
  name: string;
  sku: string;
  inStock: boolean;
  variations: WooVariation[];
}

export function wooId(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  // 1 000 000 … 2 147 483 646: positive, fits a signed 32-bit int, never a small number a real shop would also use.
  return 1_000_000 + (h % 2_146_483_647);
}

const code = (v: SkuValue | undefined): string | null => (typeof v === "string" && v !== "check" ? v : null);

let cached: WooProduct[] | null = null;

export function wooCatalog(): WooProduct[] {
  if (cached) return cached;
  const out: WooProduct[] = [];
  const add = (slug: string, name: string, productInStock: boolean, options: { id: string; name: string; inStock: boolean }[]) => {
    const entry = SHIPNITY_SKU_MAP[slug];
    if (!entry) return;
    const id = wooId(`p:${slug}`);
    if (entry.options) {
      const variations = options
        .map((o) => ({ o, sku: code(entry.options[o.id]) }))
        .filter((x): x is { o: (typeof options)[number]; sku: string } => x.sku !== null)
        .map(({ o, sku }) => ({ id: wooId(`v:${slug}/${o.id}`), parentId: id, sku, optionName: o.name, inStock: o.inStock }));
      if (variations.length === 0) return;
      out.push({ id, slug, name, sku: entry.parent ?? "", inStock: variations.some((v) => v.inStock), variations });
    } else {
      const sku = code(entry.product);
      if (sku) out.push({ id, slug, name, sku, inStock: productInStock, variations: [] });
    }
  };
  for (const p of allProducts) {
    const options = [...(p.colorVariants ?? []), ...(p.flavorVariants ?? [])].map((v) => ({
      id: v.id,
      name: v.name,
      inStock: v.availability !== "out-of-stock",
    }));
    add(p.slug, p.name, p.availability !== "out-of-stock", options);
  }
  for (const p of buildPublishedCatalog()) {
    const options = p.variants.map((v) => ({ id: v.id, name: v.label, inStock: v.availabilityStatus === "in-stock" }));
    add(p.slug, p.displayName, p.availabilityStatus === "in-stock", options);
  }
  cached = out;
  return out;
}
