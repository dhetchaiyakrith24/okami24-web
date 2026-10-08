/**
 * The owner's "sold-out list" (`sold-out.ts`, chosen 2026-09-06 as the way the owner marks stock
 * without reading code) applied to the catalog.
 *
 * Contract:
 *  - One line per option: `<product slug> | <colour or flavour name>`. Blank lines and `#` comments
 *    are ignored. Matching is case-insensitive on the trimmed name; the option's stable `id` is
 *    accepted too, so a line survives a cosmetic rename of the display name.
 *  - Listed  → that option is `"out-of-stock"` (dimmed, labelled, unselectable, rejected by the cart
 *    gate — see resolveProductRef()). Not listed → the option keeps whatever the data says, which
 *    for the legacy catalog is "unknown" (= sellable, owner default) and for ProductMaster is the
 *    Shipnity signal (only a confirmed "in-stock" sells).
 *  - The list can only ever mark something sold out. It cannot mark a ProductMaster option
 *    "in-stock" — that stays Shipnity's call (owner decision 2026-09-06, Q3: "unknown" stays
 *    unsellable until confirmed).
 *  - A line that matches nothing is NOT fatal for the site (the storefront still builds and the
 *    line just has no effect) — `sold-out-contract-test.ts` fails `npm run verify:catalog` on it
 *    instead, which is how a typo gets caught.
 *
 * This is the single place the list is read; `src/data/products/index.ts` applies it to the legacy
 * catalog at module load, and `storefront-preview-read-model.ts` consults `isListedSoldOut()` for
 * every ProductMaster variant it projects. When Shipnity stock is wired to both halves of the
 * catalog, this file becomes a manual override layer on top of it rather than the only signal.
 */
import type { Product } from "@/types/catalog";
import { SOLD_OUT_LIST } from "./sold-out";
import { SHIPNITY_SKU_MAP } from "./sku-map";

export interface SoldOutEntry {
  /** 1-based line number inside SOLD_OUT_LIST (for typo reports). */
  line: number;
  slug: string;
  /** Normalised (lower-cased, whitespace-collapsed) colour/flavour name or id. */
  option: string;
  raw: string;
}

export interface SoldOutParseProblem {
  line: number;
  raw: string;
  problem: string;
}

export const normalizeOption = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

/** Every syntactically valid line of the list, plus the lines that could not be read at all. */
export function parseSoldOutList(source: string = SOLD_OUT_LIST): { entries: SoldOutEntry[]; problems: SoldOutParseProblem[] } {
  const entries: SoldOutEntry[] = [];
  const problems: SoldOutParseProblem[] = [];
  source.split(/\r?\n/).forEach((rawLine, i) => {
    const line = i + 1;
    const text = rawLine.trim();
    if (text === "" || text.startsWith("#")) return;
    const parts = text.split("|");
    if (parts.length !== 2 || parts[0].trim() === "" || parts[1].trim() === "") {
      problems.push({ line, raw: rawLine, problem: 'expected exactly one "|" separating the product slug and the option name' });
      return;
    }
    entries.push({ line, slug: parts[0].trim().toLowerCase(), option: normalizeOption(parts[1]), raw: rawLine });
  });
  return { entries, problems };
}

const listed = new Map<string, Set<string>>();
for (const e of parseSoldOutList().entries) {
  if (!listed.has(e.slug)) listed.set(e.slug, new Set());
  listed.get(e.slug)!.add(e.option);
}

/** Is `<slug> | <name-or-id>` on the owner's sold-out list? */
export function isListedSoldOut(slug: string, nameOrId: string, id?: string): boolean {
  const options = listed.get(slug.toLowerCase());
  if (!options) return false;
  return options.has(normalizeOption(nameOrId)) || (id !== undefined && options.has(normalizeOption(id)));
}

/**
 * No Shipnity SKU (`sku-map.ts` value `null`) = the warehouse does not stock it (owner 08/10: shown "สินค้าหมด", page and
 * option stay). `id` = the option id, or omitted for a product without options. "check" and unmapped → false (as before).
 */
export function hasNoSku(slug: string, id?: string): boolean {
  const entry = SHIPNITY_SKU_MAP[slug];
  if (!entry) return false;
  if (id === undefined) return entry.product === null;
  return entry.options !== undefined && entry.options[id] === null;
}

/** The one sold-out answer for an option: on the owner's list, or no SKU in the warehouse. */
export function isMarkedSoldOut(slug: string, nameOrId: string, id?: string): boolean {
  return isListedSoldOut(slug, nameOrId, id) || (id !== undefined && hasNoSku(slug, id));
}

/** Legacy catalog: returns a copy of `products` with every listed or SKU-less colour/flavour marked out-of-stock. */
export function applySoldOut(products: Product[]): Product[] {
  return products.map((p) => {
    if (!listed.has(p.slug.toLowerCase()) && !SHIPNITY_SKU_MAP[p.slug]) return p;
    return {
      ...p,
      colorVariants: p.colorVariants?.map((v) => (isMarkedSoldOut(p.slug, v.name, v.id) ? { ...v, availability: "out-of-stock" as const } : v)),
      flavorVariants: p.flavorVariants?.map((v) => (isMarkedSoldOut(p.slug, v.name, v.id) ? { ...v, availability: "out-of-stock" as const } : v)),
    };
  });
}
