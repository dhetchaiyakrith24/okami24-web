/**
 * Run: npx tsx src/lib/stock/live-order-contract-test.ts (discovered by scripts/verify-catalog.ts)
 * The lists that follow the LIVE warehouse after a 3-hour regeneration (#1374, owner 10/11 "ตามแนะนำ"), against a throwaway
 * SQLite in the OS temp folder (never `.data/`, never the live disk) — the real migrations, the real catalogue, the real
 * home sections. The warehouse report is the build's own git snapshot (WAREHOUSE_STOCK_READ_ON) with chosen flips.
 *
 * Proves:
 *   1. liveStockReady — false on a fresh data dir (nothing reported), true once the warehouse has reported;
 *   2. the home type rows — no live answer = the editorial order exactly; a live answer = every in-stock card before every
 *      sold-out card, each group in the editorial order, the row's length unchanged; a card the live answer sells out
 *      moves behind the in-stock ones;
 *   3. newArrivalSlugs(count, live) — newest first, only what is in stock live, a sold-out new model is replaced by the
 *      next newest (the row stays full while enough models are in stock), everything out = an empty row (it hides);
 *   4. the lookalikes (T2-08, HANDOFF §18) — after every other card of their row whatever the stock, never in its first
 *      RAIL_CARDS, never in the new-arrivals row.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// `server-only` throws outside the Next server; this test is a server, so it gets the empty module it would get there.
const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

// live.ts keeps the table in memory for 10 s; each scenario moves the clock past that instead of sleeping.
const realNow = Date.now.bind(Date);
let offset = 0;
Date.now = () => realNow() + offset;
const nextRead = () => {
  offset += 11_000;
};

async function main(): Promise<void> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-live-order-test-"));
  process.env.OKAMI24_DATA_DIR = dir;
  try {
    const { getDb } = await load("src/lib/db/client.ts");
    const { liveStockReady, liveLookup } = await load("src/lib/stock/live.ts");
    const { legacyCardStock, publishedCardStock } = await load("src/lib/stock/card-stock.ts");
    const { newArrivalSlugs } = await load("src/lib/new-arrivals.ts");
    const { HomeTypeSection } = await load("src/components/home/HomeTypeSection.tsx");
    const { HOME_TYPE_SECTIONS, RAIL_CARDS } = await load("src/data/home-sections.ts");
    const { LOOKALIKES } = await load("src/data/similar-models.ts");
    const { WAREHOUSE_ALL_CODES, WAREHOUSE_OUT_OF_STOCK } = await load("src/data/stock/warehouse-stock.ts");
    const { SHIPNITY_SKU_MAP } = await load("src/data/stock/sku-map.ts");
    const { FIRST_LISTED } = await load("src/data/first-listed.ts");
    const { getProduct } = await load("src/data/products/index.ts");
    const { getPublishedProductBySlug } = await load("src/data/shipnity-seed/storefront-preview-read-model.ts");
    const db = getDb();

    type Item = { slug: string; legacy: unknown; published: unknown };
    type Section = { type: string; categories: string[]; first: string[] };
    const rowItems = (s: Section): Item[] => {
      const el = HomeTypeSection(s) as { props?: { items?: Item[] } } | null;
      return el?.props?.items ?? [];
    };
    const codes = (slug: string): string[] => {
      const e = SHIPNITY_SKU_MAP[slug] as { product?: string; options?: Record<string, string> } | undefined;
      return e ? [e.product, ...Object.values(e.options ?? {})].filter((c): c is string => typeof c === "string" && c !== "check") : [];
    };
    const report = (flips: Record<string, number>) => {
      const q = new Map<string, number>();
      for (const c of WAREHOUSE_ALL_CODES as Set<string>) q.set(c, (WAREHOUSE_OUT_OF_STOCK as Set<string>).has(c) ? 0 : 5);
      for (const [slug, n] of Object.entries(flips)) for (const c of codes(slug)) q.set(c, n);
      db.prepare("DELETE FROM woo_stock_reports").run();
      const ins = db.prepare("INSERT INTO woo_stock_reports (sku, quantity, stock_status, reported_at) VALUES (?, ?, ?, ?)");
      const at = new Date(realNow()).toISOString();
      db.transaction(() => {
        for (const [c, n] of q) ins.run(c, n, n > 0 ? "instock" : "outofstock", at);
      })();
      nextRead();
    };
    const inStockLive = (slug: string, live: unknown): boolean => {
      const p = getProduct(slug);
      if (p) return legacyCardStock(p, live).inStock;
      const pub = getPublishedProductBySlug(slug);
      return pub ? publishedCardStock(pub, live).inStock : false;
    };
    const soldOutLive = (i: Item, live: unknown): boolean =>
      i.legacy ? legacyCardStock(i.legacy, live).soldOut : i.published ? publishedCardStock(i.published, live).soldOut : false;

    // 1. nothing reported → not ready; the rows keep the editorial order (the build's, never the git snapshot's)
    check("1a. a fresh data dir: liveStockReady() = false", liveStockReady() === false);
    const editorial = new Map<string, string[]>(HOME_TYPE_SECTIONS.map((s: Section) => [s.type, rowItems(s).map((i) => i.slug)]));
    check("1b. every home section has cards without a live answer", [...editorial.values()].every((r) => r.length > 0), Object.fromEntries(editorial));

    // 2. the warehouse reports (its snapshot, plus one in-stock pod-system pick sold out live)
    const pods = HOME_TYPE_SECTIONS.find((s: Section) => s.type === "pod-systems") as Section;
    report({});
    const live0 = liveLookup();
    // victim = the first coded card the snapshot sells → 0 · rescue = the last coded card the snapshot sells out → in stock,
    // so the row has a card that must move forward and one that must move back, whatever the snapshot holds.
    const podRow = editorial.get("pod-systems")!;
    const victim = podRow.find((slug) => codes(slug).length > 0 && inStockLive(slug, live0));
    const rescue = [...podRow].reverse().find((slug) => slug !== victim && codes(slug).length > 0 && !inStockLive(slug, live0));
    check("2a. the pod-system row has a coded card to sell out and one to bring back", Boolean(victim && rescue), { podRow, victim, rescue });
    const flips: Record<string, number> = { ...(victim ? { [victim]: 0 } : {}), ...(rescue ? { [rescue]: 5 } : {}) };
    report(flips);
    check("2b. after a report: liveStockReady() = true", liveStockReady() === true);
    const live = liveLookup();
    for (const s of HOME_TYPE_SECTIONS as Section[]) {
      const before = editorial.get(s.type)!;
      const items = rowItems(s);
      const after = items.map((i) => i.slug);
      const out = new Set(items.filter((i) => soldOutLive(i, live)).map((i) => i.slug));
      const look = (x: string) => LOOKALIKES.has(x);
      const expected = [...before.filter((x) => !look(x) && !out.has(x)), ...before.filter((x) => !look(x) && out.has(x)), ...before.filter(look)];
      check(`2c. ${s.type}: same cards, same length`, after.length === before.length && [...after].sort().join() === [...before].sort().join(), { before, after });
      check(`2d. ${s.type}: in stock first, sold out last, each group in the editorial order (a lookalike after all)`, after.join() === expected.join(), { expected, after });
      for (const x of after.filter(look)) check(`4a. ${s.type}: ${x} is not in the first ${RAIL_CARDS} cards (${after.length} in the row)`, after.indexOf(x) >= RAIL_CARDS, after);
    }
    if (victim && rescue) {
      const after = rowItems(pods).map((i) => i.slug);
      const inIdx = after.map((slug, n) => (inStockLive(slug, live) ? n : -1)).filter((n) => n >= 0);
      const outIdx = after.map((slug, n) => (inStockLive(slug, live) ? -1 : n)).filter((n) => n >= 0);
      check(`2e. ${victim} (sold out live) sits behind every in-stock pod-system card`, after.indexOf(victim) > Math.max(...inIdx), after);
      check(`2f. ${rescue} (back in stock live) sits before every sold-out pod-system card`, after.indexOf(rescue) < Math.min(...outIdx), after);
    }

    // 3. new arrivals with the live answer
    const row = newArrivalSlugs(8, live) as string[];
    const dates = row.map((s) => FIRST_LISTED[s] as string);
    check("3a. newest first", dates.every((d, i) => i === 0 || dates[i - 1] >= d), row);
    check("3b. every card is in stock live", row.every((s) => inStockLive(s, live)), row);
    const newest = row[0];
    if (newest) {
      report({ ...flips, [newest]: 0 });
      const liveB = liveLookup();
      const rowB = newArrivalSlugs(8, liveB) as string[];
      const canFill = row.length === 8;
      check(`3c. ${newest} sold out live leaves the row`, !rowB.includes(newest), rowB);
      check("3d. the next newest fills its place (row length unchanged)", !canFill || rowB.length === 8, { row, rowB });
      check("3e. the cards that stayed keep their order", rowB.filter((s) => row.includes(s)).join() === row.filter((s) => s !== newest).join(), { row, rowB });
    } else {
      check("3c. the snapshot sells at least one new model", false, row);
    }
    check("4b. no lookalike in the new-arrivals row, live or as built", ![...newArrivalSlugs(8, live), ...newArrivalSlugs(8)].some((x: string) => LOOKALIKES.has(x)));
    check("3f. everything out live = an empty row (HomeNewArrivals hides)", (newArrivalSlugs(8, () => "out") as string[]).length === 0);
  } finally {
    try {
      (await load("src/lib/db/client.ts")).getDb().close();
    } catch {
      // already closed or never opened
    }
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

main()
  .catch((err) => check("the test ran", false, err instanceof Error ? err.stack : String(err)))
  .finally(() => {
    for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok || !r.detail ? "" : `\n      ${r.detail}`}`);
    const failed = results.filter((r) => !r.ok);
    if (failed.length > 0) {
      console.error(`\n${failed.length} of ${results.length} checks failed.`);
      process.exit(1);
    }
    console.log(`\nAll ${results.length} checks passed.`);
  });
