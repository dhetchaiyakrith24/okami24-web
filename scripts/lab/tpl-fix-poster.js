/* eslint-disable */
// Recipe kept from _incoming/sitewide-template/1d/fix-poster.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Checker #242 round 1 (Owner eye items 1 + 2): (a) KOKO story-screen / -themes / -battery / -power are UWELL files on their own
// black (opaque 99 %+) → not cut-outs: drop `transparent: true` so they sit in the poster card. (b) G3 Pro story-full-screen is a
// real cut-out but UWELL crops the device at the file's bottom edge → a ruler-straight cut on the dark page: alpha-only fade of the
// bottom rows to transparent (as the G5 cover, _incoming/g5-template/b6/cover-fade.js) — no pixel drawn or moved. Rewrites the file
// in place (new in this PR, never live) from UWELL's original. CRLF kept. usage (repo root): node <this>
const sharp = require("sharp");
const fs = require("fs");
(async () => {
  const SRC = `${__dirname}/mk/g3p/pc_dynamicMid.webp`, OUT = "public/assets/products/caliburn-g3-pro/story-full-screen.webp";
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  // fade from the device's lowest 22 % of its height to 0 at the file edge
  let top = H;
  for (let y = 0; y < H && top === H; y++) for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 128) { top = y; break; }
  const F0 = Math.round(H - (H - top) * 0.22);
  for (let y = F0; y < H; y++) {
    const k = 1 - (y - F0) / (H - 1 - F0);
    const e = k * k * (3 - 2 * k); // smoothstep
    for (let x = 0; x < W; x++) { const i = (y * W + x) * 4 + 3; data[i] = Math.round(data[i] * e); }
  }
  await sharp(data, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 86, alphaQuality: 100, effort: 6 }).toFile(OUT);
  console.log("faded", OUT, `rows ${F0}–${H - 1} of ${H} (device top ${top})`);
  const F = "src/data/products/uwell.ts";
  let s = fs.readFileSync(F, "utf8");
  for (const n of ["story-screen", "story-themes", "story-battery", "story-power"]) {
    const re = new RegExp(`(/assets/products/caliburn-g3-pro-koko/${n}\\.webp"[^}]*?), transparent: true \\}`);
    if (!re.test(s)) throw new Error("no " + n);
    s = s.replace(re, "$1 }");
  }
  fs.writeFileSync(F, s);
  console.log("KOKO 4 posters back in the card");
})();
