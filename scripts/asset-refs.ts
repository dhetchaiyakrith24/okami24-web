// asset-refs.ts (housekeeping 01/10) — every /assets/products/… path the catalog data really produces (incl. hidden products and
// paths built at runtime, e.g. wotofo `variant-${id}`), plus every literal in src/. Prints the tracked product files
// that NONE of these name = safe to delete, and any referenced file that is missing on disk.
// Run: npx tsx scripts/asset-refs.ts · limit: a src/ template like `${A}/part.webp` (const prefix) is not resolved —
// check each "unused" folder by hand before any delete (the anatomy sheet uses such templates).
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { catalogIncludingHidden } from "../src/data/products";

const refs = new Set<string>();
const walk = (v: unknown) => {
  if (typeof v === "string") {
    for (const m of v.matchAll(/\/assets\/products\/[^\s"'`)]+/g)) refs.add(m[0]);
  } else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === "object") Object.values(v).forEach(walk);
};
walk(catalogIncludingHidden);
const fromData = refs.size;
const tracked = execSync("git ls-files", { encoding: "utf8" }).split("\n").filter(Boolean);
for (const f of tracked.filter((f) => /^src\/.*\.(ts|tsx|css|json)$/.test(f))) walk(readFileSync(f, "utf8"));

const assets = tracked.filter((f) => f.startsWith("public/assets/products/"));
const unused = assets.filter((a) => !refs.has(a.replace(/^public/, "")));
const missing = [...refs].filter((r) => !/\$\{/.test(r) && !existsSync("public" + r));
console.log(`refs: ${fromData} from catalog data · ${refs.size} total with src literals · ${assets.length} tracked files`);
console.log(`unused (${unused.length}):`);
for (const u of unused) console.log("  " + u);
console.log(`referenced but missing on disk (${missing.length}):`);
for (const m of missing) console.log("  " + m);
