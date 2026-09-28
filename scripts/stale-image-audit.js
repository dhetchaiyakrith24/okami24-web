/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Which product photos does the live site serve STALE? (image-fix round 2026-09-29)
//   node scripts/stale-image-audit.js <list.txt> <out.md> [--optimized]
// <list.txt> = repo paths under public/assets/products (one per line). For each file it fetches the live
// /assets/... copy (Cloudflare keeps it 30 days — next.config.ts headers) and compares it with the file in the
// working tree: same bytes = fresh. With --optimized it also fetches the /_next/image copies a phone asks for
// (w=750 and w=1080, Accept webp) and compares size + a small grey thumbnail (mean abs diff) with the file.
// One request at a time with a pause: a Cloudflare MISS makes the 512 MB Render box re-encode the image.
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const [listFile, outFile] = process.argv.slice(2);
const OPT = process.argv.includes("--optimized");
const SITE = "https://okami24.store";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const sha = (b) => crypto.createHash("sha1").update(b).digest("hex").slice(0, 10);
async function get(url) {
  const r = await fetch(url, { headers: { Accept: "image/avif,image/webp,image/*,*/*;q=0.8", "User-Agent": "okami24-stale-audit" } });
  return { status: r.status, cf: r.headers.get("cf-cache-status"), buf: Buffer.from(await r.arrayBuffer()) };
}
async function thumb(buf) {
  return sharp(buf).flatten({ background: "#15171c" }).resize(64, 64, { fit: "contain", background: "#15171c" }).greyscale().raw().toBuffer();
}
const mad = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; };
(async () => {
  const files = fs.readFileSync(listFile, "utf8").split(/\r?\n/).filter(Boolean);
  const rows = ["| file | raw /assets | w=750 | w=1080 |", "|---|---|---|---|"];
  let stale = 0;
  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const local = fs.readFileSync(f);
    const pub = f.replace(/^public/, "");
    const raw = await get(SITE + pub);
    const rawOk = raw.status === 200 && sha(raw.buf) === sha(local);
    const cells = [rawOk ? "fresh" : `**STALE** (${raw.status} ${raw.cf})`];
    let bad = !rawOk;
    if (OPT) {
      const lt = await thumb(local); const lm = await sharp(local).metadata();
      for (const w of [750, 1080]) {
        await sleep(400);
        const o = await get(`${SITE}/_next/image?url=${encodeURIComponent(pub)}&w=${w}&q=75`);
        if (o.status !== 200) { cells.push(`${o.status}`); bad = true; continue; }
        const m = await sharp(o.buf).metadata();
        const expect = Math.min(w, lm.width);
        const d = mad(lt, await thumb(o.buf));
        const ok = m.width === expect && d < 6;
        if (!ok) bad = true;
        cells.push(`${ok ? "ok" : "**STALE**"} ${m.format} ${m.width}px (want ${expect}) diff ${d.toFixed(1)} ${o.cf}`);
      }
    }
    if (bad) stale++;
    rows.push(`| ${pub} | ${cells.join(" | ")} |`);
    await sleep(250);
  }
  const head = `# Stale product images on the live site — ${new Date().toISOString()}\n\n${files.length} files checked · ${stale} stale somewhere\n\n`;
  fs.writeFileSync(outFile, head + rows.join("\n") + "\n");
  console.log(`${files.length} files · ${stale} stale → ${outFile}`);
})();
