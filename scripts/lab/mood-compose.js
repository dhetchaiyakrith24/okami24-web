/* eslint-disable */
// Recipe kept from _incoming/sitewide-template/5/mood/compose.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// LESSONS 20 for MOOOD: one device body (master = n-grape: chrome mouthpiece like the maker's photos), each flavour's own
// label band pasted in. Rows (normalized 1000x2000): 0..396 master (cap + mouthpiece), 396..1475 flavour (label: seams sit
// in the black strips at rows ~368-426 and ~1454-1496), 1475..2000 master (white screen panel). 12-row linear blends.
// Then the master silhouette (flatcut of the padded master) is the alpha of every flavour -> ai/t-<name>.png (1120x2120).
// usage: node compose.js [names...]   (default: every n-*.png except the master)
const sharp = require("sharp"); const fs = require("fs"); const path = require("path"); const { execFileSync } = require("child_process");
const dir = path.join(__dirname, "ai"); const PAD = 60, W = 1000, H = 2000;
const A = 396, B = 1475, F = 6;
const raw = async f => (await sharp(path.join(dir, f)).removeAlpha().raw().toBuffer());
(async () => {
  const master = await raw("n-grape.png");
  // master alpha via flatcut on the padded master
  const padded = path.join(dir, "m-padded.png"), cut = path.join(dir, "m-cut.png");
  await sharp(master, { raw: { width: W, height: H, channels: 3 } }).extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: "#262626" }).png().toFile(padded);
  execFileSync("node", [path.join(__dirname, "../../../../scripts/flatcut.js"), padded, cut], { stdio: "inherit" });
  const alpha = await sharp(cut).extractChannel(3).raw().toBuffer();
  let names = process.argv.slice(2);
  if (!names.length) names = fs.readdirSync(dir).filter(f => /^n-.*\.png$/.test(f)).map(f => f.slice(2, -4));
  for (const n of names) {
    const fl = await raw(`n-${n}.png`);
    const out = Buffer.alloc(W * H * 3);
    for (let y = 0; y < H; y++) {
      let w; // weight of the flavour row
      if (y < A - F || y >= B + F) w = 0; else if (y < A + F) w = (y - (A - F)) / (2 * F); else if (y < B - F) w = 1; else w = 1 - (y - (B - F)) / (2 * F);
      for (let x = 0; x < W; x++) { const i = (y * W + x) * 3; for (let c = 0; c < 3; c++) out[i + c] = Math.round(master[i + c] * (1 - w) + fl[i + c] * w); }
    }
    const pw = W + 2 * PAD, ph = H + 2 * PAD;
    const rgb = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: "#262626" }).raw().toBuffer();
    // un-mix the edge from the #262626 background where alpha is partial (same idea as flatcut)
    const rgba = Buffer.alloc(pw * ph * 4);
    for (let p = 0; p < pw * ph; p++) {
      const a = alpha[p] / 255;
      for (let c = 0; c < 3; c++) { let v = rgb[p * 3 + c]; if (a > 0 && a < 1) v = Math.max(0, Math.min(255, (v - 38 * (1 - a)) / a)); rgba[p * 4 + c] = v; }
      rgba[p * 4 + 3] = alpha[p];
    }
    await sharp(rgba, { raw: { width: pw, height: ph, channels: 4 } }).png().toFile(path.join(dir, `t-${n}.png`));
    console.log("t-" + n);
  }
})();
