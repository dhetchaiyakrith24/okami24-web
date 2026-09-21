/**
 * OKami24 — search aliases (round "search-price", 2026-09-22).
 *
 * What a visitor TYPES into the search box, mapped to the English term the catalog stores. These
 * strings are never rendered: THAI_STYLE §2 layer 1 (brand and model names stay English on the
 * site, never transliterated) is about what the site shows, and this file only listens. Read by
 * src/lib/catalog-search.ts; every entry is exercised by catalog-search-contract-test.ts, which
 * fails on an alias that finds nothing its English term finds.
 *
 * Keys are the normalised token (lower-case, no spaces) exactly as `normalizeQuery` produces it;
 * values are the English terms the token stands for (any one matching is enough).
 */

/** Token → English terms. Block A carries a source; block B is the spelling Thai customers are
 *  believed to use — a wrong guess here finds nothing extra and harms nothing, but the owner may
 *  prune the block. */
export const TERM_SEARCH_ALIASES: Record<string, string[]> = {
  // ── A · sourced ────────────────────────────────────────────────────────────────────────────
  // Round file _incoming/search-price/round.md, pass list (owner-approved spellings):
  "คาลิเบิร์น": ["caliburn"],
  "ดราก": ["drag"],
  "อาร์กัส": ["argus"],
  // "Marbo" is how the SALTHUB line is marketed (salthub.com footer carries the Marbo logo —
  // note in src/data/products/salthub.ts; the m-bar-15k head copy says "M Bar 15K (Marbo)").
  marbo: ["salthub"],
  "มาโบ": ["salthub"],
  // The site's own home H1 says "พอตไฟฟ้า"; Search Console records "บุหรี่ไฟฟ้า drag"
  // (docs/SEO_BASELINE.md). Both mean a pod device — "พอต" is the Thai word in every device
  // category label (พอตซิสเต็ม · พอตคิท · พอตใช้แล้วทิ้ง).
  "พอตไฟฟ้า": ["พอต"],
  "บุหรี่ไฟฟ้า": ["พอต"],
  // ── B · believed spellings (brand names), unsourced ─────────────────────────────────────
  "ยูเวล": ["uwell"],
  "ยูเวลล์": ["uwell"],
  "วูปู": ["voopoo"],
  "ซอลท์ฮับ": ["salthub"],
  "รีแลกซ์": ["relx"],
  "รีแล็กซ์": ["relx"],
  "ไอคอส": ["iqos"],
  "จอยเวย์": ["joiway"],
  "วินชี": ["vinci"],
};

/** Slug → extra terms that belong to one product only. Empty today: the family/brand-level
 *  aliases above cover every case the round found. Add a row here when one product is known by
 *  a name no field carries (and say where the name comes from). */
export const PRODUCT_SEARCH_ALIASES: Record<string, string[]> = {};
