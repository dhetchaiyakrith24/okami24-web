/**
 * The second half of a grid's search text (flavours, specs, aliases — catalog-search.ts SearchText.secondary), fetched once
 * per page load the first time a visitor uses a grid's search box (speed round, owner 13/11). The grid pages used to carry
 * it for every product in their payload and in every prefetch of them; most visitors never type. One request serves every
 * grid: the answer covers the whole storefront, keyed `legacy:<slug>` / `published:<slug>` like CatalogBrowser's entries.
 * A failed request answers `null` (the grid keeps searching by primary text) and is tried again on the next focus.
 */
export const SEARCH_SECONDARY_PATH = "/api/catalog-search";

let request: Promise<Record<string, string> | null> | null = null;
let requested: string | null = null;

/** `version` = catalogSearchVersion() from the server page — part of the URL, so a changed catalog is a new address. */
export function loadSearchSecondary(version: string): Promise<Record<string, string> | null> {
  if (requested !== version) request = null;
  requested = version;
  request ??= fetch(`${SEARCH_SECONDARY_PATH}?v=${encodeURIComponent(version)}`)
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : Promise.reject(new Error(String(r.status)))))
    .catch(() => {
      request = null;
      return null;
    });
  return request;
}
