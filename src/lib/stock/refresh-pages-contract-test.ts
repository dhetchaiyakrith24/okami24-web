/**
 * Run: npx tsx src/lib/stock/refresh-pages-contract-test.ts (discovered by scripts/verify-catalog.ts)
 * Which pages a warehouse stock push marks stale (T2-05, src/lib/stock/refresh-pages.ts): only a flip between selling and
 * sold out (or a first report) counts, merged the way saveStockReport merges, and a flip marks the product, its category,
 * its brand, the home page and /products. Pure — no database, no server.
 */
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// `server-only` throws outside the Next server; the catalogue modules this reads import it.
const req = createRequire(path.join(process.cwd(), "package.json"));
req.cache[req.resolve("server-only")] = { exports: {} } as never;

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });
const load = (rel: string) => import(pathToFileURL(path.join(process.cwd(), rel)).href);

async function main(): Promise<void> {
  const { flippedSlugs, pagesToRefresh } = await load("src/lib/stock/refresh-pages.ts");
  const { SHIPNITY_SKU_MAP } = await load("src/data/stock/sku-map.ts");
  const { getProduct } = await load("src/data/products/index.ts");
  const { getCategory } = await load("src/data/categories.ts");
  const { getBrand } = await load("src/data/brands.ts");

  // a storefront product with a warehouse code of its own or on an option
  type Entry = { product?: unknown; options?: Record<string, unknown> };
  const codesOf = (e: Entry) => [e.product, ...Object.values(e.options ?? {})].filter((c): c is string => typeof c === "string" && c !== "check");
  const [slug, entry] = (Object.entries(SHIPNITY_SKU_MAP) as [string, Entry][]).find(([s, e]) => getProduct(s) && codesOf(e).length > 0)!;
  const code = codesOf(entry)[0];
  const r = (quantity: number | null, stockStatus: string | null = null) => ({ quantity, stockStatus });
  const w = (quantity: number | null, stockStatus: string | null = null) => ({ sku: code, quantity, stockStatus });

  check("1. no writes = nothing to refresh", flippedSlugs(new Map(), []).length === 0 && pagesToRefresh([]).length === 0);
  check("2. 7 left → 6 left is not a flip", flippedSlugs(new Map([[code, r(7)]]), [w(6)]).length === 0);
  const sold = flippedSlugs(new Map([[code, r(3)]]), [w(0)]);
  check(`3. ${slug}: selling → 0 is a flip`, sold.includes(slug), sold);
  const back = flippedSlugs(new Map([[code, r(0)]]), [w(4)]);
  check(`4. ${slug}: 0 → selling is a flip`, back.includes(slug), back);
  const first = flippedSlugs(new Map(), [w(5)]);
  check("5. a first report is a flip (the pages had only the build's stock)", first.includes(slug), first);
  check(
    "6. a status-only write keeps the old number, as saveStockReport merges (5 + outofstock = still selling)",
    flippedSlugs(new Map([[code, r(5, "instock")]]), [w(null, "outofstock")]).length === 0,
  );
  check("7. a status-only write on a code without a number flips", flippedSlugs(new Map([[code, r(null, "instock")]]), [w(null, "outofstock")]).includes(slug));
  check("8. a code no product reads flips nothing", flippedSlugs(new Map(), [{ sku: "NOT-A-REAL-CODE-0000", quantity: 5, stockStatus: null }]).length === 0);

  const p = getProduct(slug);
  const pages = pagesToRefresh([slug]) as string[];
  const want = ["/", "/products", `/products/${slug}`, `/products/${getCategory(p.categoryId).slug}`, `/brands/${getBrand(p.brandId).slug}`];
  check(`9. ${slug} flipped → its page, category, brand, the home page and /products`, want.every((x) => pages.includes(x)) && pages.length === new Set(want).size, { want, pages });
  check("10. paths are site paths (start with /, no trailing slash but the home page)", pages.every((x) => x === "/" || (x.startsWith("/") && !x.endsWith("/"))), pages);
}

main()
  .catch((err) => check("the test ran", false, err instanceof Error ? err.stack : String(err)))
  .finally(() => {
    for (const x of results) console.log(`${x.ok ? "PASS" : "FAIL"}  ${x.name}${x.ok || !x.detail ? "" : `\n      ${x.detail}`}`);
    const failed = results.filter((x) => !x.ok);
    if (failed.length > 0) {
      console.error(`\n${failed.length} of ${results.length} checks failed.`);
      process.exit(1);
    }
    console.log(`\nAll ${results.length} checks passed.`);
  });
