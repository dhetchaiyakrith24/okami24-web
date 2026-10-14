/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// OKami24 — poster stretch check (LESSONS พ17, owner 04/10 on live #255: the DRAG X3 cover was a 904-px file shown
// ~1,300 css px wide on a 1440 screen = 2.9x enlarged on a 2x display, and nobody looked at 100%).
//
//   node scripts/poster-stretch.js <base-url> <slug> [<slug>...] [--max 1.3]
//   e.g. node scripts/poster-stretch.js http://localhost:3000 drag-s3 drag-x3
//        node scripts/poster-stretch.js https://okami24.store drag-6
//
// For every story poster / cover / anatomy image on each product page (src under /assets/products/<slug>/ whose file
// name starts with story- or sits in anatomy/), it reads the width the page draws it at 1440 (desktop, counted at 2x)
// and at 390 (phone, counted at 3x), then the pixel width of the source file in public/. need = the larger of
// (css width x DPR) / file width. need > --max (default 1.3) = FAIL: find a larger maker file or show it smaller —
// never enlarge a file with text in it by AI without the letter-by-letter check (designer.md Owner eye · LESSONS-images พ17).
// Uses scripts/shot.js (--eval) for the page measurement, so it needs Chrome like every other screenshot here.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const argv = process.argv.slice(2);
const maxAt = argv.indexOf("--max");
const MAX = maxAt >= 0 ? +argv[maxAt + 1] : 1.3;
const pos = argv.filter((a, i) => !a.startsWith("--") && !(maxAt >= 0 && i === maxAt + 1));
const [base, ...slugs] = pos;
if (!base || !slugs.length) { console.error("usage: node scripts/poster-stretch.js <base-url> <slug> [<slug>...] [--max 1.3]"); process.exit(2); }

const ROOT = process.cwd();
const TMP = fs.mkdtempSync(path.join(require("os").tmpdir(), "poster-stretch-"));
// Scroll through the page first so lazy images get their layout box, then report each story image's drawn width.
const MEASURE = `(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
  const pick = s => { try { const u = new URL(s, location.href); const q = u.searchParams.get('url'); return decodeURIComponent(q || u.pathname); } catch { return s; } };
  const seen = {};
  for (const i of document.querySelectorAll('img')) {
    const src = pick(i.currentSrc || i.src);
    if (!/^\\/assets\\/products\\/[^/]+\\/(story-|anatomy\\/)/.test(src)) continue;
    const w = Math.round(i.getBoundingClientRect().width);
    if (w > (seen[src] || 0)) seen[src] = w;
  }
  return seen;
})()`;

function measure(url, desktop) {
  const out = path.join(TMP, "m.png");
  const args = ["scripts/shot.js", out, url, "--viewport", "--wait", "2500", "--eval", MEASURE];
  if (desktop) args.push("--desktop", "--width", "1440"); else args.push("--width", "390");
  const log = execFileSync(process.execPath, args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "inherit"] });
  const line = log.split(/\r?\n/).find((l) => l.startsWith("eval →"));
  if (!line) throw new Error(`no measurement from ${url}`);
  return JSON.parse(line.slice("eval →".length).trim()) || {};
}

(async () => {
  let fail = 0, rows = 0;
  for (const slug of slugs) {
    const url = `${base.replace(/\/$/, "")}/products/${slug}`;
    const desk = measure(url, true), phone = measure(url, false);
    for (const src of [...new Set([...Object.keys(desk), ...Object.keys(phone)])].sort()) {
      if (!src.includes(`/assets/products/${slug}/`)) continue;
      const file = path.join(ROOT, "public", src);
      if (!fs.existsSync(file)) { console.log(`MISSING ${src}`); fail++; continue; }
      const { width } = await sharp(file).metadata();
      const d = (desk[src] || 0) * 2, p = (phone[src] || 0) * 3;
      const need = Math.max(d, p) / width;
      const ok = need <= MAX;
      rows++; if (!ok) fail++;
      console.log(`${ok ? "ok  " : "FAIL"} ${src}  file ${width}px · 1440: ${desk[src] || 0}css → ${d}px · 390: ${phone[src] || 0}css → ${p}px · x${need.toFixed(2)}`);
    }
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log(`poster-stretch: ${rows} image(s), ${fail} over x${MAX} → ${fail ? "FAIL" : "PASS"}`);
  process.exit(fail ? 1 : 0);
})();
