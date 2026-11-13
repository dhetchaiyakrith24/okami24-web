/**
 * The second half of a grid's search text (flavours, specs, aliases — catalog-search.ts SearchText.secondary), fetched once
 * per page load the first time a visitor uses a grid's search box (speed round, owner 13/11). The grid pages used to carry
 * it for every product in their payload and in every prefetch of them; most visitors never type. One request serves every
 * grid: the answer covers the whole storefront, keyed `legacy:<slug>` / `published:<slug>` like CatalogBrowser's entries.
 * A failed request answers `null` (the grid keeps searching by primary text) and is tried again on the next focus.
 */
export const SEARCH_SECONDARY_PATH = "/api/catalog-search";

let request: Promise<Record<string, string> | null> | null = null;

export function loadSearchSecondary(): Promise<Record<string, string> | null> {
  request ??= fetch(SEARCH_SECONDARY_PATH)
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : Promise.reject(new Error(String(r.status)))))
    .catch(() => {
      request = null;
      return null;
    });
  return request;
}
