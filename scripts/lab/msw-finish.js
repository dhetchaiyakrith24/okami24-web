/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/msw/finish.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// M Switch pod photos, last local step (round "image-sitewide" batch 2): each flavour's pod cut out by GPT Image 2.5
// (transparent background) from our Higgsfield re-render of SALTHUB's own per-flavour pod photo (out/cut/<id>.png).
//   1. halo clean-up: a few cut-outs keep a faint smoke/splash haze (Mango Passion, Mixberry). Keep only the largest
//      solid blob (alpha > 200), grown by 6 px, and multiply the original alpha by it — the pod's own soft edge stays.
//   2. trim, then pre-size so the long side is 840 px (the product box of the 1000-px variant canvas, lanczos3) +
//      output sharpening sigma 0.5 — the M Bar 9K / 10K standard step; process-images then centres it.
// Output: final/<id>.png + final-sheet.png (all flavours on the page colour, for the eye check of names and colours).
// usage (repo root): node _incoming/image-sitewide/msw/finish.js [id ...]
const sharp = require("sharp");
const fs = require("fs");
const D = "_incoming/image-sitewide/msw";
fs.mkdirSync(`${D}/final`, { recursive: true });

async function clean(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const solid = new Uint8Array(N);
  for (let p = 0; p < N; p++) solid[p] = data[p * 4 + 3] > 200 ? 1 : 0;
  // largest 4-connected blob of solid pixels
  const lab = new Int32Array(N);
  let best = 0, bestSize = 0, next = 0;
  const stack = new Int32Array(N);
  for (let p = 0; p < N; p++) {
    if (!solid[p] || lab[p]) continue;
    next++; let sp = 0, size = 0; stack[sp++] = p; lab[p] = next;
    while (sp) {
      const q = stack[--sp]; size++;
      const x = q % W, y = (q - x) / W;
      for (const r of [x > 0 ? q - 1 : -1, x < W - 1 ? q + 1 : -1, y > 0 ? q - W : -1, y < H - 1 ? q + W : -1]) {
        if (r >= 0 && solid[r] && !lab[r]) { lab[r] = next; stack[sp++] = r; }
      }
    }
    if (size > bestSize) { bestSize = size; best = next; }
  }
  // grow the blob by 6 px (separable max filter) so the anti-aliased rim is kept
  const R = 6;
  let keep = new Uint8Array(N);
  for (let p = 0; p < N; p++) keep[p] = lab[p] === best ? 1 : 0;
  const tmp = new Uint8Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = 0; for (let k = -R; k <= R && !v; k++) { const xx = x + k; if (xx >= 0 && xx < W && keep[y * W + xx]) v = 1; } tmp[y * W + x] = v; }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let v = 0; for (let k = -R; k <= R && !v; k++) { const yy = y + k; if (yy >= 0 && yy < H && tmp[yy * W + x]) v = 1; } keep[y * W + x] = v; }
  let dropped = 0;
  for (let p = 0; p < N; p++) if (!keep[p] && data[p * 4 + 3]) { dropped++; data[p * 4 + 3] = 0; }
  return { buf: await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer(), dropped };
}

(async () => {
  const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(`${D}/out/cut`).map((f) => f.replace(".png", "")).sort();
  const tiles = [];
  for (const [i, id] of ids.entries()) {
    const { buf, dropped } = await clean(`${D}/out/cut/${id}.png`);
    const trimmed = await sharp(buf).trim({ threshold: 1 }).png().toBuffer();
    const m = await sharp(trimmed).metadata();
    const k = 840 / Math.max(m.width, m.height);
    const out = await sharp(trimmed).resize({ width: Math.round(m.width * k), height: Math.round(m.height * k), kernel: "lanczos3" }).sharpen({ sigma: 0.5 }).png().toBuffer();
    await sharp(out).toFile(`${D}/final/${id}.png`);
    console.log(id, `${m.width}x${m.height} -> ${Math.round(m.width * k)}x${Math.round(m.height * k)}`, "haze px dropped", dropped);
    const t = await sharp({ create: { width: 900, height: 900, channels: 3, background: "#121214" } }).composite([{ input: out, gravity: "center" }]).png().toBuffer();
    tiles.push({ input: await sharp(t).resize(300).toBuffer(), left: (i % 6) * 305, top: Math.floor(i / 6) * 305 });
  }
  const rows = Math.ceil(ids.length / 6);
  await sharp({ create: { width: 6 * 305, height: rows * 305, channels: 3, background: "#000" } }).composite(tiles).png().toFile(`${D}/final-sheet.png`);
})();
