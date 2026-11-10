/**
 * Run: npx tsx src/lib/client-catalog-imports-contract-test.ts (discovered by scripts/verify-catalog.ts)
 * No "use client" file reaches a catalog module through its VALUE imports, directly or through any chain (T2-50, 10/11).
 * Such an import bundles the raw product files into a browser chunk — the team's picture notes ("OKami24 render
 * (Higgsfield) …", IMAGE_SPEC items, _incoming paths) and the source links — however carefully the server strips its own
 * output. A client gets the catalog as props from its server page instead (finder-catalog.ts, the search / favorites /
 * compare pages). `import type` leaves no code behind; a "use server" module (a Server Action) hands the browser
 * references, not its code — the walk stops at both.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const CATALOG_MODULES = new Set([
  "src/data/products/index.ts",
  "src/lib/catalog-index.ts",
  "src/data/shipnity-seed/storefront-bridge.ts",
  "src/data/shipnity-seed/storefront-preview-read-model.ts",
  "src/data/shipnity-seed/max-seed.ts",
]);

const norm = (p: string) => p.split(path.sep).join("/");
const resolve = (from: string, spec: string): string | null => {
  let base: string;
  if (spec.startsWith("@/")) base = path.join(root, "src", spec.slice(2));
  else if (spec.startsWith(".")) base = path.join(path.dirname(from), spec);
  else return null;
  for (const c of [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
};
const VALUE_IMPORT = /^(?:import|export)\s+(?!type\b)(?:[^;]*?\s+from\s+)?["']([^"']+)["']/gm;
const USE_CLIENT = /^\s*["']use client["']/;
const USE_SERVER = /^\s*["']use server["']/;

/** The first chain from `entry` to a catalog module, or null. */
function chainToCatalog(entry: string): string[] | null {
  const seen = new Set<string>();
  const walk = (file: string, chain: string[]): string[] | null => {
    const rel = norm(path.relative(root, file));
    if (CATALOG_MODULES.has(rel)) return [...chain, rel];
    if (seen.has(rel)) return null;
    seen.add(rel);
    const text = fs.readFileSync(file, "utf8");
    if (chain.length > 0 && USE_SERVER.test(text)) return null;
    for (const m of text.matchAll(VALUE_IMPORT)) {
      const next = resolve(file, m[1]);
      const hit = next ? walk(next, [...chain, rel]) : null;
      if (hit) return hit;
    }
    return null;
  };
  return walk(entry, []);
}

const files: string[] = [];
const collect = (dir: string) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) collect(p);
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  }
};
collect(path.join(root, "src"));

const clients = files.filter((f) => USE_CLIENT.test(fs.readFileSync(f, "utf8")));
const offenders = clients.map(chainToCatalog).filter((c): c is string[] => c !== null).map((c) => c.join(" → "));

const results = [
  { name: `the scan found the client files (${clients.length})`, ok: clients.length > 20, detail: "" },
  { name: "no client file reaches a catalog module through value imports", ok: offenders.length === 0, detail: offenders.join("\n      ") },
];
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok || !r.detail ? "" : `\n      ${r.detail}`}`);
const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
