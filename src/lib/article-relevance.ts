/**
 * OKami24 — which article does THIS product's page send a reader to? (round "backlink",
 * 2026-09-22)
 *
 * Measured before this round: 0 of the 53 product pages linked to a guide or a technology page,
 * while the 12 articles carried 65 links the other way. So the articles were reachable from the
 * index and from each other and nothing else — and a customer standing on a product page with a
 * question had nowhere to go.
 *
 * Nothing here is a judgement call about "what feels related". A pairing exists only when the
 * data already says so, in one of two ways:
 *
 *   1. AUTHORED — the article's own `relatedProductSlugs` (src/data/guides.ts,
 *      src/data/technology.ts). Someone wrote that list while writing the article; reading it
 *      backwards adds no new claim. These come first.
 *   2. RULE — a fact on the product record, named per rule in `evidence` below, that the article
 *      is about: a device with a verified battery spec → the battery article; a touchscreen
 *      device → the touchscreen article; a pod or coil → the pod/coil maintenance article. Every
 *      rule reads VERIFIED spec rows or a typed attribute, never a guess and never a spec row
 *      whose own `sourceStatus` is "unverified". Draw style (MTL/DTL) is deliberately absent:
 *      `attributes.drawStyle` is a Finder attribute with no verified spec row behind it
 *      (standing ruling, HANDOFF §16), so the MTL/DTL article is only ever reached through an
 *      authored link.
 *
 * A product that matches nothing gets no links — the round's rule, and the honest outcome for
 * (say) a TEREA stick, which none of the twelve articles is about. The cap is three per page.
 * Guarded by src/lib/article-relevance-contract-test.ts, which recomputes every rule's evidence
 * from the data and fails on a link to an article or product that does not exist.
 */
import { guides } from "@/data/guides";
import { technologyEntries } from "@/data/technology";
import { GUIDES_COPY_TH, GUIDES_COPY_ZH } from "@/i18n/guides-copy";
import { TECHNOLOGY_COPY_TH, TECHNOLOGY_COPY_ZH } from "@/i18n/technology-copy";
import type { Product, Specification } from "@/types/catalog";
import type { StorefrontProductView } from "@/data/shipnity-seed/storefront-preview-read-model";

export interface RelatedArticle {
  /** "guide" | "technology" — the route family, and the label the card shows. */
  kind: "guide" | "technology";
  /** Record id, which is also the slug for every current record. */
  id: string;
  href: string;
  /** English title/name; the component overlays the visitor's language the way /guides does. */
  title: string;
  /** The TH / ZH title (guides-copy · technology-copy), looked up here on the server so RelatedArticles (a Client Component)
   *  does not import those tables — they hold every article body (round SEO ฉ speed work part 3, 14/10). */
  titleTh?: string;
  titleZh?: string;
  /** Why this pairing exists — read by the contract test and by anyone auditing a page. */
  why: string;
}

/** Round 10B (owner ruling 2026-09-24): a Thai-only guide (Guide.thaiOnly) is never offered on an English or Chinese
 *  page. `skipThaiOnly` builds that page's list — the same order and cap, so the slot a Thai-only article took on the
 *  Thai page goes back to the next related article instead of leaving the box short. */
export interface RelatedArticleOptions {
  skipThaiOnly?: boolean;
}

const MAX_PER_PRODUCT = 3;

const GUIDE_BY_ID = new Map(guides.map((g) => [g.id, g]));
const TECH_BY_ID = new Map(technologyEntries.map((t) => [t.id, t]));

function article(kind: "guide" | "technology", id: string, why: string): RelatedArticle | null {
  if (kind === "guide") {
    const g = GUIDE_BY_ID.get(id);
    return g ? { kind, id, href: `/guides/${g.slug}`, title: g.title, titleTh: GUIDES_COPY_TH[id]?.title, titleZh: GUIDES_COPY_ZH[id]?.title, why } : null;
  }
  const t = TECH_BY_ID.get(id);
  return t ? { kind, id, href: `/technology/${t.slug}`, title: t.name, titleTh: TECHNOLOGY_COPY_TH[id]?.name, titleZh: TECHNOLOGY_COPY_ZH[id]?.name, why } : null;
}

/** article id → the products the article itself lists, read backwards. */
const AUTHORED = (() => {
  const map = new Map<string, { kind: "guide" | "technology"; id: string }[]>();
  const add = (slug: string, kind: "guide" | "technology", id: string) => map.set(slug, [...(map.get(slug) ?? []), { kind, id }]);
  for (const g of guides) for (const slug of g.relatedProductSlugs ?? []) add(slug, "guide", g.id);
  for (const t of technologyEntries) for (const slug of t.relatedProductSlugs ?? []) add(slug, "technology", t.id);
  return map;
})();

/** A verified spec row whose key or value carries `needle` (case-insensitive). Unverified rows
 *  are ignored on purpose: a page may not send a reader somewhere on an unconfirmed fact. */
function verifiedSpec(specs: ReadonlyArray<Pick<Specification, "key" | "value" | "sourceStatus">>, needle: RegExp): string | null {
  const hit = specs.find((s) => s.sourceStatus === "verified" && (needle.test(s.key) || needle.test(s.value)));
  return hit ? `${hit.key}: ${hit.value}` : null;
}

const POD_OR_COIL = new Set(["pods-cartridges", "coils-accessories"]);
const DEVICE_CATEGORIES = new Set(["pod-systems", "switch-pods", "disposables"]);
// Owner 19/10: the "pod-kits" devices moved into pod-systems / switch-pods. Since 20/10 (owner lifted the 22/10 hold) every
// pod-systems device counts — the VOOPOO refill devices are open systems too, the format the article compares.
const comparedFormat = (p: { categoryId: string }) => p.categoryId === "disposables" || p.categoryId === "pod-systems";

/** Round seo-push-2710: a bottle of e-liquid is what these three articles are about (salt nic or freebase · the PG/VG
 *  ratio · filling a pod) — before this, no e-liquid page linked any article. */
function eLiquidRules(p: { categoryId: string }): (RelatedArticle | null)[] {
  if (p.categoryId !== "e-liquid") return [];
  const why = `category ${p.categoryId}`;
  return [article("guide", "salt-nic-vs-freebase", why), article("guide", "pg-vg-in-e-liquid", why), article("guide", "refilling-a-pod", why)];
}

/** Round seo-push-2710 batch 4: eleven articles had no product page linking them. These rules run LAST, so they only
 *  fill a box that still has room after every rule above (LESSONS 35: never push an existing link out). The evidence
 *  is the category the product is shown under — what each article is about: a pod or coil can burn or leak · a
 *  disposable buyer chooses a disposable and a flavour · a switch-pod buyer chooses a flavour · a pod-system device
 *  wears out and its pod can leak. */
function tailRules(p: { categoryId: string }): (RelatedArticle | null)[] {
  const why = `category ${p.categoryId}`;
  const ids: Record<string, string[]> = {
    "pods-cartridges": ["fixing-a-burnt-pod", "fixing-a-leaking-pod"],
    "coils-accessories": ["fixing-a-burnt-pod", "fixing-a-leaking-pod"],
    disposables: ["choosing-a-disposable", "choosing-a-pod-flavor", "fixing-a-burnt-pod"],
    "switch-pods": ["choosing-a-pod-flavor", "fixing-a-burnt-pod"],
    "pod-systems": ["how-long-a-pod-device-lasts", "fixing-a-leaking-pod"],
  };
  return (ids[p.categoryId] ?? []).map((id) => article("guide", id, why));
}

/** Rules for a legacy product record (the rich one: typed attributes + spec rows). */
function legacyRules(p: Product): RelatedArticle[] {
  const out: (RelatedArticle | null)[] = [];
  const spec = (re: RegExp) => verifiedSpec(p.specifications, re);

  // The two format articles: only for the formats they compare.
  if (p.attributes.beginnerFriendly && DEVICE_CATEGORIES.has(p.categoryId)) out.push(article("guide", "choosing-your-first-pod-system", `attributes.beginnerFriendly = true, category ${p.categoryId}`));
  if (comparedFormat(p)) out.push(article("guide", "open-system-vs-disposable", `category ${p.categoryId} is one of the two formats the article compares`));

  // Facts the product itself states.
  if (p.attributes.batteryMah !== undefined || spec(/battery|แบต/i)) out.push(article("guide", "battery-care-and-charging", spec(/battery|แบต/i) ?? `attributes.batteryMah = ${p.attributes.batteryMah}`));
  if (p.attributes.wattageMin !== undefined && p.attributes.wattageMax !== undefined) out.push(article("guide", "choosing-wattage-and-airflow", `attributes.wattageMin/Max = ${p.attributes.wattageMin}–${p.attributes.wattageMax}`));
  if (p.attributes.screenType === "touchscreen") out.push(article("technology", "onboard-touch-displays", `attributes.screenType = touchscreen`));
  if (POD_OR_COIL.has(p.categoryId)) out.push(article("guide", "coil-and-pod-maintenance", `category ${p.categoryId}`));
  out.push(...eLiquidRules(p));

  const mesh = spec(/mesh/i);
  if (mesh) out.push(article("technology", "mesh-coil-systems", mesh));
  const chip = spec(/chip|gene\.|ชิป/i);
  if (chip) out.push(article("technology", "high-output-chip-platforms", chip));
  const gesture = spec(/triple-tap|gesture|แตะ/i) ?? (p.features.some((f) => /triple-tap|gesture/i.test(f.title)) ? `feature: ${p.features.find((f) => /triple-tap|gesture/i.test(f.title))!.title}` : null);
  if (gesture) out.push(article("technology", "gesture-and-triple-tap-control", gesture));
  // "Several resistances on one cartridge" — true when the product's own pod/coil row says so.
  const resistances = p.specifications.filter((s) => s.sourceStatus === "verified" && /resistance|โอห์ม|ohm/i.test(`${s.key} ${s.value}`));
  if (resistances.length > 1 || resistances.some((s) => (s.value.match(/\d+(\.\d+)?\s*(Ω|โอห์ม|ohm)/gi) ?? []).length > 1)) {
    out.push(article("technology", "multi-resistance-cartridges", `${resistances.length} verified resistance row(s): ${resistances.map((s) => s.value).join(" / ")}`));
  }
  if (p.attributes.beginnerFriendly && DEVICE_CATEGORIES.has(p.categoryId)) out.push(article("guide", "how-to-vape-without-coughing", `attributes.beginnerFriendly = true, category ${p.categoryId}`));
  out.push(...tailRules(p));

  return out.filter((a): a is RelatedArticle => a !== null);
}

/** Rules for a published ProductMaster product (pods and coils: a few verified rows, an option
 *  axis, no typed attributes — see storefront-preview-read-model.ts). */
function publishedRules(p: StorefrontProductView): RelatedArticle[] {
  const out: (RelatedArticle | null)[] = [];
  // Round 7 "SEO ค" B3 (2026-09-23): the published DEVICE pages (a switch-style pod kit, a
  // disposable, the two IQOS devices) had no rule at all — measured 0 article links on
  // iqosheet-16 / iqosheet-18 / pod-159 (instruction, confirmed by scope-auditor). The same three
  // format/battery rules the legacy branch applies, on the same evidence: the category the record
  // is published under, and a VERIFIED battery row (an unverified row still sends nobody anywhere).
  // Order matters: MAX_PER_PRODUCT keeps the first three, so the rules that name THIS product's
  // own verified fact (mesh, resistance axis, maintenance) stay ahead of the format/battery
  // rules — the designer's B3 pass caught pod-180 losing its mesh-coil link to three generic
  // guides when the new rules ran first.
  if (POD_OR_COIL.has(p.categoryId)) out.push(article("guide", "coil-and-pod-maintenance", `category ${p.categoryId}`));
  out.push(...eLiquidRules(p));
  if (p.optionAxisCode === "resistance" && p.variants.length > 1) out.push(article("technology", "multi-resistance-cartridges", `option axis "resistance" with ${p.variants.length} values`));
  const mesh = verifiedSpec(p.specifications, /mesh/i);
  if (mesh) out.push(article("technology", "mesh-coil-systems", mesh));
  if (DEVICE_CATEGORIES.has(p.categoryId)) out.push(article("guide", "choosing-your-first-pod-system", `published device, category ${p.categoryId}`));
  if (comparedFormat(p)) out.push(article("guide", "open-system-vs-disposable", `category ${p.categoryId} is one of the two formats the article compares`));
  const battery = verifiedSpec(p.specifications, /battery|แบต|mAh/i);
  if (battery) out.push(article("guide", "battery-care-and-charging", battery));
  out.push(...tailRules(p));
  return out.filter((a): a is RelatedArticle => a !== null);
}

function withAuthoredFirst(slug: string, ruled: RelatedArticle[], opts: RelatedArticleOptions = {}): RelatedArticle[] {
  const authored = (AUTHORED.get(slug) ?? []).map((a) => article(a.kind, a.id, `the article's own relatedProductSlugs lists ${slug}`)).filter((a): a is RelatedArticle => a !== null);
  const seen = new Set<string>();
  const out: RelatedArticle[] = [];
  for (const a of [...authored, ...ruled]) {
    if (seen.has(a.href)) continue;
    if (opts.skipThaiOnly && a.kind === "guide" && GUIDE_BY_ID.get(a.id)?.thaiOnly) continue;
    seen.add(a.href);
    out.push(a);
    if (out.length === MAX_PER_PRODUCT) break;
  }
  return out;
}

export function relatedArticlesForLegacy(product: Product, opts?: RelatedArticleOptions): RelatedArticle[] {
  return withAuthoredFirst(product.slug, legacyRules(product), opts);
}

export function relatedArticlesForPublished(product: StorefrontProductView, opts?: RelatedArticleOptions): RelatedArticle[] {
  return withAuthoredFirst(product.slug, publishedRules(product), opts);
}

/**
 * Round "SEO ง" batch 6 (2026-10-07): brand and category pages get the same "อ่านต่อ" box. Measured on the live site
 * that day: none of the 29 brand/category pages linked an article, and the keyword map (docs/SEO_LANDSCAPE.md §0) names
 * pages such as /products/pod-systems, /brands/joiway and /products/infy-20k that no article linked either.
 *
 * Same rule as above — no judgement call, the data already says it. An article belongs on a collection page when
 *   1. its own text links that page (`](/products/pod-systems)` in the Thai or English body), or
 *   2. it is about products shown on that page: a body link to one of them, or its own `relatedProductSlugs`.
 * Ordered by (1) first, then by how many of the page's products it covers; ties keep the article order of /guides
 * (guides, then technology). Same cap of three, same Thai-only rule for en/zh.
 */
const LINK_IN_TEXT = /\]\((\/[^)\s#?]+)\)/g;

function linkedPaths(...records: unknown[]): Set<string> {
  const out = new Set<string>();
  for (const r of records) if (r) for (const m of JSON.stringify(r).matchAll(LINK_IN_TEXT)) out.add(m[1]);
  return out;
}

/** article → every page it points at: body links (English record + Thai overlay) and its relatedProductSlugs. */
const ARTICLE_TARGETS: { kind: "guide" | "technology"; id: string; paths: Set<string> }[] = [
  ...guides.map((g) => {
    const paths = linkedPaths(g.body, g.faq, GUIDES_COPY_TH[g.id]?.body, GUIDES_COPY_TH[g.id]?.faq);
    for (const slug of g.relatedProductSlugs ?? []) paths.add(`/products/${slug}`);
    return { kind: "guide" as const, id: g.id, paths };
  }),
  ...technologyEntries.map((t) => {
    const paths = linkedPaths(t.body, t.faq, TECHNOLOGY_COPY_TH[t.id]?.body, TECHNOLOGY_COPY_TH[t.id]?.faq);
    for (const slug of t.relatedProductSlugs ?? []) paths.add(`/products/${slug}`);
    return { kind: "technology" as const, id: t.id, paths };
  }),
];

export function relatedArticlesForCollection(pagePath: string, productSlugs: readonly string[], opts: RelatedArticleOptions = {}): RelatedArticle[] {
  const productPaths = [...new Set(productSlugs)].map((s) => `/products/${s}`);
  const scored = ARTICLE_TARGETS.map((t, order) => {
    const direct = t.paths.has(pagePath);
    const covered = productPaths.filter((p) => t.paths.has(p));
    const why = direct ? `the article links ${pagePath}` : `the article covers ${covered.length} product(s) on this page: ${covered.join(", ")}`;
    return { t, order, score: (direct ? 1000 : 0) + covered.length, why };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order);
  const out: RelatedArticle[] = [];
  for (const s of scored) {
    if (opts.skipThaiOnly && s.t.kind === "guide" && GUIDE_BY_ID.get(s.t.id)?.thaiOnly) continue;
    const a = article(s.t.kind, s.t.id, s.why);
    if (!a || a.href === pagePath) continue;
    out.push(a);
    if (out.length === MAX_PER_PRODUCT) break;
  }
  return out;
}
