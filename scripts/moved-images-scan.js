/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// Proves src/data/moved-images.json on a running site: every old name answers 301 once, to a picture that answers 200.
//   node scripts/moved-images-scan.js http://localhost:3412 [--sample N]
// Checks per old name: /assets path = 301 + Location = the table's target · the target = 200 image, no redirect ·
// /_next/image?url=<old> = 301 to the same URL with the new name. The first N (default 30) optimizer URLs are also followed to 200.
// Prints the counts and every failure; exit 1 on any failure. Live site: Cloudflare may still answer 200 from its cache
// for a name that was live until the deploy (30-day cache), so read the test server for the proof.
const fs = require("fs");
const base = process.argv[2];
if (!base) { console.error("usage: node scripts/moved-images-scan.js <base> [--sample N]"); process.exit(2); }
const si = process.argv.indexOf("--sample");
const sample = si > 0 ? Number(process.argv[si + 1]) : 30;
const moved = JSON.parse(fs.readFileSync("src/data/moved-images.json", "utf8"));
const rows = Object.entries(moved);
const seen = { ok301: 0, target200: 0, opt301: 0, opt200: 0 };
const fails = [];
const get = (u) => fetch(base + u, { redirect: "manual", headers: { accept: "image/webp" } });
const targets = new Map();
async function one([from, to], i) {
  const r = await get(from);
  if (r.status === 301 && r.headers.get("location") === to) seen.ok301++;
  else fails.push(`${from}: ${r.status} ${r.headers.get("location") ?? ""}`);
  const q = `/_next/image?url=${encodeURIComponent(from)}&w=640&q=75`;
  const o = await get(q);
  const loc = o.headers.get("location") ?? "";
  if (o.status === 301 && loc.includes(encodeURIComponent(to))) seen.opt301++;
  else fails.push(`${q}: ${o.status} ${loc}`);
  if (i < sample) {
    const f = await get(loc);
    if (f.status === 200) seen.opt200++;
    else fails.push(`follow ${loc}: ${f.status}`);
  }
  if (!targets.has(to)) {
    targets.set(to, true);
    const t = await get(to);
    if (t.status === 200 && /^image\//.test(t.headers.get("content-type") ?? "")) seen.target200++;
    else fails.push(`target ${to}: ${t.status} ${t.headers.get("location") ?? ""}`);
  }
}
(async () => {
  let next = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (next < rows.length) { const i = next++; await one(rows[i], i); }
  }));
  console.log(`rows ${rows.length} · 301 ${seen.ok301} · optimizer 301 ${seen.opt301} · optimizer followed 200 ${seen.opt200}/${Math.min(sample, rows.length)} · targets 200 ${seen.target200}/${targets.size} · failures ${fails.length}`);
  for (const f of fails.slice(0, 40)) console.log("FAIL", f);
  process.exit(fails.length ? 1 : 0);
})();
