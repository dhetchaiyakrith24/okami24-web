/** Up to 8 cards in a row of suggestions (owner 27/10). Apart from the catalog tables, so the browser can read it. */
export const RELATED_SLOTS = 8;

/** Cards the "similar models we have" block shows on a page with nothing to buy (round popular models 07/11). */
const SIMILAR_SLOTS = 4;

/** Which of the block's candidates it shows on this live answer. One rule for the block, the head's jump button and the
 *  related row below, which leaves these out so no card shows twice on a page. */
export function shownSimilar(slugs: string[], changes: Record<string, { s: boolean }> | null): string[] {
  return slugs.filter((slug) => changes?.[slug]?.s !== false).slice(0, SIMILAR_SLOTS);
}

/** The server's row for one product (/api/related/<slug>): `s` = the row in order, `c` = the cards the page was not built with. */
export interface RelatedAnswer<T> {
  s: string[];
  c: T[];
}

/**
 * What the block shows. With the server's answer, exactly its row, which is the cart's row for the same stock. Before it, or on
 * a page that does not ask (guides, technology), the page's own cards with the /api/stock answer laid over the build.
 */
export function shownRow<T extends { slug: string; inStock: boolean }>(
  items: T[],
  changes: Record<string, { s: boolean }> | null,
  answer: RelatedAnswer<T> | null
): T[] {
  if (answer) {
    const known = [...items, ...answer.c];
    return answer.s.map((slug) => known.find((i) => i.slug === slug)).filter((i): i is T => i !== undefined);
  }
  return items.filter((i) => changes?.[i.slug]?.s ?? i.inStock).slice(0, RELATED_SLOTS);
}
