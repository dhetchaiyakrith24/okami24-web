/**
 * OKami24 — storefront search matching (round "search-price", 2026-09-22).
 *
 * One matcher for every search box on the site: /search (`searchProducts` in
 * src/data/products/index.ts + `searchPublishedProducts` in src/data/shipnity-seed/
 * storefront-bridge.ts) and the search field of the catalog grids (CatalogBrowser.tsx on
 * /products, the category pages and the brand pages). Before this round each of those had its
 * own English-only string and asked `includes(query)`, so the words the site itself teaches a
 * visitor — "พอตซิสเต็ม", "พอตใช้แล้วทิ้ง", "หัวพอต" — found nothing, and "drag6" / "mbar" (the
 * spellings Search Console records) found nothing either.
 *
 * What a query has to pass now:
 *   1. The query is normalised: lower-cased, invisible characters removed (a visitor who pastes
 *      text from the site brings the WORD JOINER / NBSP that thaiTypography() inserts at render),
 *      whitespace collapsed.
 *   2. It is split on whitespace into tokens and EVERY token must match (AND). "caliburn g5" =
 *      caliburn AND g5; "m bar 15k" = m AND bar AND 15k. A token matches when it is a substring
 *      of the product's text, or — with every non-letter removed on both sides — of its compact
 *      text ("drag6" ↔ "DRAG 6", "mbar" ↔ "M Bar", "caliburng5" ↔ "Caliburn G5").
 *   3. A token that is a search alias (src/data/search-aliases.ts) also matches through the
 *      English term it stands for: "คาลิเบิร์น" → "caliburn", "marbo" → "salthub".
 *
 * The text a product is matched against comes in two parts, both built by the caller with
 * `searchText()`:
 *   - primary   — what the product IS: names, brand, family, category (English and the Thai
 *                 label a visitor reads on the site), colour/flavour names, aliases;
 *   - secondary — what it SAYS about itself: tagline, feature titles, spec values.
 * A match in either part counts; `queryScore` ranks a product matched by its identity above one
 * matched only by a spec line, so "หัวพอต" lists the pods before the devices whose spec says
 * which pod they take. The long description paragraphs are deliberately in neither part:
 * "ไม่ต้องเติมน้ำยา" contains "น้ำยา", and a search for e-liquid must not return every
 * disposable that says it needs none.
 *
 * Guarded by src/lib/catalog-search-contract-test.ts (picked up by `npm run verify:catalog`).
 */
import { PRODUCT_SEARCH_ALIASES, TERM_SEARCH_ALIASES } from "@/data/search-aliases";

/** Characters that are never typed on purpose but arrive by copy-paste: ZERO WIDTH SPACE,
 *  WORD JOINER, ZERO WIDTH NO-BREAK SPACE, and NO-BREAK SPACE (which becomes a plain space).
 *  Written as code points so the repo never holds the raw characters (thai-typography.ts rule:
 *  the checker greps every source file for them). */
const INVISIBLE = new RegExp(`[${String.fromCharCode(0x200b)}${String.fromCharCode(0x2060)}${String.fromCharCode(0xfeff)}]`, "g");
const NBSP = new RegExp(String.fromCharCode(0x00a0), "g");

/** Everything that is not a letter, a combining mark (Thai vowels/tone marks are marks, not
 *  letters — dropping them would corrupt the word) or a digit. */
const NOT_ALNUM = /[^\p{L}\p{M}\p{N}]+/gu;

/** Both parts are lower-cased, whitespace-normalised strings. They travel from a server page to
 *  the client grid as props, so they stay plain text — the compact form is derived when matching. */
export interface SearchText {
  primary: string;
  secondary: string;
}

type Field = string | null | undefined;

export function normalizeQuery(query: string): string {
  return query.replace(INVISIBLE, "").replace(NBSP, " ").toLowerCase().replace(/\s+/g, " ").trim();
}

function compact(text: string): string {
  return text.replace(NOT_ALNUM, "");
}

function index(fields: ReadonlyArray<Field>): string {
  return normalizeQuery(fields.filter((f): f is string => typeof f === "string" && f.length > 0).join(" "));
}

/** Builds the text a product is matched against. Empty/undefined fields are skipped, so a
 *  product with no Thai copy simply has less text — never a placeholder. Product-level aliases
 *  (src/data/search-aliases.ts) join the primary part. */
export function searchText(input: { slug: string; primary: ReadonlyArray<Field>; secondary: ReadonlyArray<Field> }): SearchText {
  return {
    primary: index([...input.primary, ...(PRODUCT_SEARCH_ALIASES[input.slug] ?? [])]),
    secondary: index(input.secondary),
  };
}

/** True when `term` (an English alias target, possibly two words) occurs in either part of the
 *  product text — exactly what an alias token matches through. Used by the contract test. */
export function phraseMatches(term: string, text: SearchText): boolean {
  const t = normalizeQuery(term);
  return termIn(t, text.primary) || termIn(t, text.secondary);
}

function termIn(term: string, text: string): boolean {
  if (!term) return false;
  if (text.includes(term)) return true;
  const c = compact(term);
  return c.length > 0 && compact(text).includes(c);
}

/** 0 = no match. Otherwise 1 for the match itself plus 1 per token that matched in the primary
 *  part — the number a results list sorts by (higher first). */
function tokenScore(token: string, text: SearchText): number {
  const terms = [token, ...(TERM_SEARCH_ALIASES[token] ?? [])];
  if (terms.some((t) => termIn(t, text.primary))) return 2;
  if (terms.some((t) => termIn(t, text.secondary))) return 1;
  return 0;
}

/** Every whitespace-separated token of `query` must match (directly or through an alias). An
 *  empty query scores 0 — the search page shows its prompt instead. */
export function queryScore(query: string, text: SearchText): number {
  const q = normalizeQuery(query);
  if (!q) return 0;
  let score = 1;
  for (const token of q.split(" ")) {
    const s = tokenScore(token, text);
    if (s === 0) return 0;
    score += s - 1;
  }
  return score;
}

export function queryMatches(query: string, text: SearchText): boolean {
  return queryScore(query, text) > 0;
}

/** Filters `items` to the ones matching `query`, best match first; ties keep the input order
 *  (the data order every grid already uses). */
export function rankByQuery<T>(query: string, items: ReadonlyArray<T>, textOf: (item: T) => SearchText): T[] {
  return items
    .map((item, order) => ({ item, order, score: queryScore(query, textOf(item)) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .map((r) => r.item);
}
