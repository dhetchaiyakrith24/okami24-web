/**
 * Shipnity Max product list vs src/data/stock/sku-map.ts (owner 10/11: "never drift silently again"). Pure and
 * self-contained — no import and no outside name — because scripts/sku-map-drift.ts pastes `skuDrift.toString()` into the
 * browser snippet that runs on the Max product page (the rows never leave the page; only the drift does).
 *
 * Three lists:
 *   fill    — an option the site maps to null, and an unmapped Max child of the SAME Max parent whose name is that option's
 *             id word for word ("menthol-freeze" = "Menthol Freeze"), one match only. Only these are safe to write into sku-map.
 *   unknown — Max codes no site option maps (a new colour or flavour, a box set, a product the site does not list). A person
 *             decides; under the catalog-completeness rule a new colour/flavour of a listed product goes onto its page too.
 *   gone    — codes sku-map maps that Max no longer lists (the option keeps an old stock signal until it is set to null).
 * Rows "Close" / "test" are Max's own system rows and are ignored.
 */

export interface MaxRow {
  code: string;
  name: string;
  /** Max parent code; null = a parent (or single-product) row. */
  parent: string | null;
  /** 1 = มีของ, 0 = ไม่มีของ. */
  stock: number;
}

export interface MapProduct {
  slug: string;
  parent: string | null;
  /** option id → Max code or null; a product with no options has the single key "". "check" counts as unmapped. */
  options: Record<string, string | null>;
}

export interface Drift {
  fill: { slug: string; option: string; code: string; name: string; stock: number }[];
  unknown: { code: string; name: string; parent: string | null; parentName: string | null; slug: string | null }[];
  gone: { slug: string; option: string; code: string }[];
}

export function skuDrift(rows: MaxRow[], products: MapProduct[]): Drift {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9฀-๿]+/g, "");
  const system = new Set(["Close", "test"]);
  const live = rows.filter((r) => !system.has(r.code) && !(r.parent && system.has(r.parent)));
  const inMax = new Set(live.map((r) => r.code));
  const rowOf = new Map(live.map((r) => [r.code, r] as const));
  const mapped = new Set<string>();
  for (const p of products) {
    if (p.parent) mapped.add(p.parent);
    for (const v of Object.values(p.options)) if (v && v !== "check") mapped.add(v);
  }
  // A Max parent belongs to the site product whose own parent code it is, or whose options use its children.
  const slugOfParent = new Map<string, string>();
  for (const p of products) if (p.parent) slugOfParent.set(p.parent, p.slug);
  for (const p of products) {
    for (const v of Object.values(p.options)) {
      const parent = v ? rowOf.get(v)?.parent : null;
      if (parent && !slugOfParent.has(parent)) slugOfParent.set(parent, p.slug);
    }
  }
  const fill: Drift["fill"] = [];
  const unknown: Drift["unknown"] = [];
  const taken = new Set<string>();
  for (const r of live) {
    if (mapped.has(r.code)) continue;
    const slug = slugOfParent.get(r.parent ?? r.code) ?? null;
    const product = slug ? products.find((p) => p.slug === slug) : undefined;
    const hits =
      product && r.parent
        ? Object.entries(product.options).filter(([id, v]) => (v === null || v === "check") && !taken.has(`${product.slug}/${id}`) && norm(id) === norm(r.name))
        : [];
    if (product && hits.length === 1) {
      taken.add(`${product.slug}/${hits[0][0]}`);
      fill.push({ slug: product.slug, option: hits[0][0], code: r.code, name: r.name, stock: r.stock });
    } else {
      unknown.push({ code: r.code, name: r.name, parent: r.parent, parentName: r.parent ? (rowOf.get(r.parent)?.name ?? null) : null, slug });
    }
  }
  const gone: Drift["gone"] = [];
  for (const p of products) {
    if (p.parent && !inMax.has(p.parent)) gone.push({ slug: p.slug, option: "(parent)", code: p.parent });
    for (const [id, v] of Object.entries(p.options)) if (v && v !== "check" && !inMax.has(v)) gone.push({ slug: p.slug, option: id, code: v });
  }
  return { fill, unknown, gone };
}
