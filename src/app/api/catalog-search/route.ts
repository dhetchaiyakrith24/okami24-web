import { allProducts } from "@/data/products";
import { getPublishedProducts } from "@/data/shipnity-seed/storefront-bridge";
import { catalogSearchSecondary } from "@/lib/catalog-search-entries";

/**
 * GET /api/catalog-search — every storefront product's secondary search text, for the grid search boxes
 * (src/lib/catalog-search-secondary.ts). Built once at build time from the same catalog the grid pages are built from,
 * so it never disagrees with them; no visitor data, nothing per request.
 */
export const dynamic = "force-static";

export function GET(): Response {
  return Response.json(catalogSearchSecondary(allProducts, getPublishedProducts()));
}
