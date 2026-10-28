import "server-only";
import { allCatalogItems } from "@/lib/catalog-index";
import { getProduct } from "@/data/products";
import { getPublishedProductBySlug } from "@/data/shipnity-seed/storefront-preview-read-model";
import { resolveProductRef } from "@/lib/commerce/catalog-resolver";
import { liveLookup, liveQuantityLookup } from "@/lib/stock/live";

/**
 * The staff stock book (owner 29/10: "หัวข้อตรวจสต๊อกให้ทีมงาน เวลาลูกค้าถามว่าสินค้าตัวนี้ๆเหลืออะไรบ้าง"): every product the
 * site sells, each option with the answer the CART would give right now — so what staff tell a customer on LINE is exactly
 * what the customer can then order. "Sells" = resolveProductRef with live stock (the same call the cart and checkout make:
 * owner's sold-out list, Shipnity's live count, build-time stock as fallback). `qty` = Shipnity's last count, or null when
 * the warehouse has never reported that code (the option then sells or not on the build-time read alone).
 * Products without an owner-approved price are left out — the site does not sell them, so there is nothing to tell.
 */

export interface StockOption {
  id: string | null;
  name: string;
  sells: boolean;
  qty: number | null;
}

export interface StockProduct {
  slug: string;
  name: string;
  brand: string | null;
  price: number;
  options: StockOption[];
}

export function stockBook(): StockProduct[] {
  const live = liveLookup();
  const qtyOf = liveQuantityLookup();
  const out: StockProduct[] = [];
  for (const item of allCatalogItems()) {
    if (item.sellingPrice === null) continue;
    const legacy = item.origin === "legacy" ? getProduct(item.slug) : undefined;
    const published = item.origin === "product-master" ? getPublishedProductBySlug(item.slug) : undefined;
    const raw: { id: string; name: string }[] = legacy
      ? [...(legacy.colorVariants ?? []), ...(legacy.flavorVariants ?? [])].map((v) => ({ id: v.id, name: v.name }))
      : (published?.variants ?? []).map((v) => ({ id: v.id, name: v.label }));
    const options: StockOption[] =
      raw.length > 0
        ? raw.map((o) => ({
            id: o.id,
            name: o.name,
            sells: resolveProductRef({ origin: item.origin, slug: item.slug, variantId: o.id }, live).ok,
            qty: qtyOf(item.slug, o.id),
          }))
        : [
            {
              id: null,
              name: item.name,
              sells: resolveProductRef({ origin: item.origin, slug: item.slug, variantId: null }, live).ok,
              qty: qtyOf(item.slug),
            },
          ];
    out.push({ slug: item.slug, name: item.name, brand: item.brandName, price: item.sellingPrice, options });
  }
  return out;
}
