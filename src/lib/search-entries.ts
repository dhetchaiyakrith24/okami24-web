import { allProducts, legacySearchText } from "@/data/products";
import { getPublishedProducts, publishedSearchText } from "@/data/shipnity-seed/storefront-bridge";
import { cardOnly } from "@/lib/related-order";
import { LOOKALIKES } from "@/data/similar-models";
import type { SearchEntry } from "@/components/tools/SearchTool";

/** What /search searches, built on the server so the browser never bundles the catalog modules (T2-50): the search text from
 *  the full record, the card from the card-only one (related-order.ts cardOnly). Same order as before — legacy, then published;
 *  ties keep it. The lookalikes are left out (T2-08, owner 10/11: off the home page and the search results — their own page and
 *  their category page stay). */
export function searchEntries(): SearchEntry[] {
  return [
    ...allProducts.map((p) => ({ hit: { kind: "legacy" as const, product: cardOnly(p) }, text: legacySearchText(p) })),
    ...getPublishedProducts().map((p) => ({ hit: { kind: "published" as const, product: p }, text: publishedSearchText(p) })),
  ].filter((e) => !LOOKALIKES.has(e.hit.product.slug));
}
