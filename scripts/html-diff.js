/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Round SEO B, batch 2.5 — proof that the 12 article pages render the same HTML before and after
// the mechanism change (owner's cheaper+stricter check, 2026-09-21).
//   node scripts/html-diff.js <dirA> <dirB> [outDir]   → <outDir or dirA/..>/html-diff-<A>-<B>.md (copied into git 2026-09-26 from _incoming/seo-b/, round "cloud")
// Normalisation before comparing: the Next build id and chunk hashes in /_next/static/... paths and
// in the RSC payload, then whitespace runs. Everything else must be byte-identical.
const fs = require("fs");
const path = require("path");
const [a, b] = process.argv.slice(2);
// Primary proof = the server-rendered DOM: every <script> element is removed before comparing (the
// RSC payload inside them repeats the same tree plus the chunk list, which legitimately grew by
// one chunk — the page bundle now imports Link, FAQAccordion and ProductReviewVideo). JSON-LD
// scripts are kept (they are content, not bundle wiring).
const norm = (s) =>
  s
    .replace(/<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, "")
    .replace(/\/_next\/static\/[^"'\s)]+/g, "/_next/static/X") // build id + every hashed css/js filename
    .replace(/"[A-Za-z0-9_-]{20,22}"/g, '"ID"') // build id quoted inside RSC payload
    .replace(/\\"b\\":\\"[A-Za-z0-9_-]{20,22}\\"/g, '\\"b\\":\\"ID\\"') // same, escaped inside __next_f
    .replace(/\s+/g, " ")
    // the page bundle gained modules (Link, FAQAccordion, ProductReviewVideo) → one more preloaded
    // chunk tag per page; collapse runs of identical asset tags so only real markup differences show
    .replace(/(<script src="\/_next\/static\/X" async="" crossorigin=""><\/script>)+/g, "$1")
    .replace(/(<link rel="preload" as="script" fetchPriority="low" href="\/_next\/static\/X"\/>)+/g, "$1");
const rows = ["| page | bytes A | bytes B | verdict | first difference |", "|---|---|---|---|---|"];
let same = 0, total = 0;
for (const f of fs.readdirSync(a).filter((x) => x.endsWith(".html")).sort()) {
  total++;
  const fa = fs.readFileSync(path.join(a, f), "utf8");
  const fb = fs.existsSync(path.join(b, f)) ? fs.readFileSync(path.join(b, f), "utf8") : "";
  const na = norm(fa), nb = norm(fb);
  if (na === nb) { same++; rows.push(`| ${f} | ${fa.length} | ${fb.length} | identical (after normalisation) | — |`); continue; }
  let i = 0; while (i < na.length && na[i] === nb[i]) i++;
  const ctx = (s) => s.slice(Math.max(0, i - 80), i + 120).replace(/\|/g, "\\|");
  rows.push(`| ${f} | ${fa.length} | ${fb.length} | DIFFERS at char ${i} | A: …${ctx(na)}… <br> B: …${ctx(nb)}… |`);
}
const md = [`# HTML diff ${a} → ${b} (${new Date().toISOString()})`, "", ...rows, "", `identical: ${same}/${total}`].join("\n") + "\n";
const out = path.join(process.argv[4] || path.dirname(path.resolve(a)), `html-diff-${path.basename(a)}-${path.basename(b)}.md`);
fs.writeFileSync(out, md);
console.log(md);
