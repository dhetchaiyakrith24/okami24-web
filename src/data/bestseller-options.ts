/**
 * "ขายดี" on single flavours / colours of a product page (owner 02/11, queue item 7 + answer 3: "B รายกลิ่น สุ่มกลิ่นได้เลย
 * หาใช้แชทลูกหาข้อมูลได้เลยครับ"). Keyed by product slug → option ids (the flavour/colour `id` of a legacy product, the
 * variant id of a published one). The product-level badge stays in src/data/sales-badges.ts; this list is separate on
 * purpose: one product can carry the product badge, its flavour badges, both or neither.
 * Where each pick comes from (manufacturer tag · Thai shop sold counts · the owner's leave to pick) is recorded per
 * product in `_incoming/queue-0211/bestseller-flavours.md`; an id that is not on the product is caught by
 * src/data/bestseller-options-contract-test.ts.
 */
export const BEST_SELLER_OPTIONS: Readonly<Record<string, readonly string[]>> = {
  // pod789.com "รสชาติยอดนิยม" / "กลิ่นยอดนิยม" per model, read 02/11 (no maker tags or sold counts exist — see the notes file)
  "m-bar-10k": ["watermelon-mint", "grape"],
  "m-switch-kit": ["grape", "doublemint"],
  "m-switch-pod": ["grape", "doublemint"],
  "relx-smash-go-12k": ["double-mint", "grape"],
  "joiway-f3": ["grape-ice"],
  "infy-20k": ["lychee", "grape-apple"],
  "muro-sc-8000": ["extreme-menthol", "honey-lemon"],
  "muro-connector-20k": ["apple-baraku", "double-mint"],
  "esko-bar-switch-pod": ["Pod-160-1", "Pod-160-7"],
  "pod-159": ["pod-159-verified-grape", "pod-159-verified-pink-guava"],
  "nexbar-switch-15k-pod": ["Pod-181-1", "Pod-181-6"],
  "eliquid-1": ["ELQ-1-1"],
};

const EMPTY: ReadonlySet<string> = new Set();
const SETS = new Map(Object.entries(BEST_SELLER_OPTIONS).map(([slug, ids]) => [slug, new Set(ids) as ReadonlySet<string>]));

/** The best-selling option ids of a product (empty set when it has none). */
export function bestSellerOptions(slug: string): ReadonlySet<string> {
  return SETS.get(slug) ?? EMPTY;
}
