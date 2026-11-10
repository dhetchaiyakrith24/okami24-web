/**
 * Run: npx tsx src/lib/client-catalog-imports-contract-test.ts (discovered by scripts/verify-catalog.ts)
 * No "use client" file VALUE-imports a catalog module (T2-50, 10/11). Such an import bundles the raw product files into a
 * browser chunk — the team's picture notes ("OKami24 render (Higgsfield) …", IMAGE_SPEC items, _incoming paths) and the
 * source links — however carefully the server strips its own output. A client gets the catalog as props from its server
 * page instead (finder-catalog.ts, the search / favorites / compare pages). `import type` is fine: it leaves no code behind.
 * Direct imports only; the build check that covers everything is a grep of .next/static (see the PR that added this).
 */
import fs from "node:fs";
import path from "node:path";

const SERVER_ONLY_CATALOG = [
  "@/data/products",
  "@/data/products/index",
  "@/lib/catalog-index",
  "@/data/shipnity-seed/storefront-bridge",
  "@/data/shipnity-seed/storefront-preview-read-model",
  "@/data/shipnity-seed/max-seed",
  "@/lib/finder-catalog",
  "@/lib/related-order",
  "@/lib/similar-in-stock",
];

const files: string[] = [];
const walk = (dir: string) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
  }
};
walk(path.join(process.cwd(), "src"));

const offenders: string[] = [];
let clientFiles = 0;
for (const f of files) {
  const text = fs.readFileSync(f, "utf8");
  if (!/^\s*["']use client["']/.test(text)) continue;
  clientFiles++;
  // every `import … from "<module>"` that is not `import type …`
  for (const m of text.matchAll(/^import\s+(?!type\b)([^;]*?)\s+from\s+["']([^"']+)["']/gm)) {
    if (SERVER_ONLY_CATALOG.includes(m[2])) offenders.push(`${path.relative(process.cwd(), f)} → ${m[2]}`);
  }
}

const results = [
  { name: `the scan found the client files (${clientFiles})`, ok: clientFiles > 20, detail: "" },
  { name: "no client file value-imports a catalog module", ok: offenders.length === 0, detail: offenders.join("\n      ") },
];
for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok || !r.detail ? "" : `\n      ${r.detail}`}`);
const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`\nAll ${results.length} checks passed.`);
