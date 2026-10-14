/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/msw/v4.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// M Switch Pod v4 (owner 30/09 on v3: "บางตัวปากกว้าง บางตัวเบี้ยว" — each flavour was its own AI re-pose, so shapes drifted).
// ONE master pod for every flavour (lesson 19): the Doublemint pod of batch 2 (up/doublemint.png — GPT Image upright
// re-pose of SALTHUB's own photo, the most symmetrical of the 17). Each flavour keeps its OWN printed label (M logo +
// name tag, cut from SALTHUB's own per-flavour photo in batch 2 — the colours, gradients and names are SALTHUB's, no AI
// wrote them): the label is lifted off up/<id>.png and laid on the master, scaled so every M logo is the same height (width picks up edge glare on some sources)
// and placed so every M logo starts at the same height — only the label changes when a customer swipes.
//   1. per source: trim to the pod; print pixels in the body zone = saturated or near-white; split into the M logo
//      (upper cluster) and the tag (lower) at the widest empty row gap; label mask = print grown 3 px + holes filled
//      (the black letters inside the tag) + 1 px feather.
//   2. master: its own label erased — per column, a straight blend between the body colour just above and just below.
//   3. per flavour: master + that label → v4/final/<id>.png (840-px long side, lanczos3 + sharpen 0.5, the batch-2 finish)
//      and v4/hi/<id>.png (full size, for the card). Sheet: v4/final-sheet.png.
// usage (repo root): node _incoming/image-sitewide/msw/v4.js
const sharp = require("sharp");
const fs = require("fs");
const D = "_incoming/image-sitewide/msw";
const MASTER = "doublemint";
fs.mkdirSync(`${D}/v4/final`, { recursive: true });
fs.mkdirSync(`${D}/v4/hi`, { recursive: true });

async function load(id) {
  const t = await sharp(`${D}/up/${id}.png`).ensureAlpha().trim({ threshold: 1 }).raw().toBuffer({ resolveWithObject: true });
  return { data: t.data, W: t.info.width, H: t.info.height };
}
const isPrint = (r, g, b) => { const mx = Math.max(r, g, b), mn = Math.min(r, g, b); return (mx - mn > 55 && mx > 100) || mn > 150; };

function findLabel(img) {
  const { data, W, H } = img;
  const y0 = Math.round(H * 0.4), y1 = Math.round(H * 0.95);
  const cand = new Uint8Array(W * H);
  for (let y = y0; y < y1; y++) for (let x = Math.round(W * 0.1); x < W * 0.9; x++) {
    const p = y * W + x, i = p * 4;
    if (data[i + 3] > 200 && isPrint(data[i], data[i + 1], data[i + 2])) cand[p] = 1;
  }
  // 8-connected components of print pixels; M = the largest blob that is not a thin glare line; the tag = the big
  // blobs just under it (its black letters sit inside one solid-colour blob)
  const lab = new Int32Array(W * H), comps = [];
  for (let p = 0; p < W * H; p++) {
    if (!cand[p] || lab[p]) continue;
    const c = { n: 0, x0: 1e9, x1: -1, y0: 1e9, y1: -1, id: comps.length + 1 }, st = [p]; lab[p] = c.id;
    while (st.length) { const q = st.pop(), y = (q / W) | 0, x = q % W; c.n++; if (x < c.x0) c.x0 = x; if (x > c.x1) c.x1 = x; if (y < c.y0) c.y0 = y; if (y > c.y1) c.y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const r = q + dy * W + dx; if (r >= 0 && r < W * H && cand[r] && !lab[r]) { lab[r] = c.id; st.push(r); } } }
    comps.push(c);
  }
  const solid = comps.filter((c) => c.y1 - c.y0 > H * 0.03 && (c.x1 - c.x0) / (c.y1 - c.y0) < 3);
  const big = solid.sort((a, b) => b.n - a.n).filter((c, k, arr) => c.n > arr[0].n * 0.3 && (c.x1 - c.x0) / (c.y1 - c.y0) > 0.6 && (c.x1 - c.x0) / (c.y1 - c.y0) < 1.6);
  const m = big.sort((a, b) => a.y0 - b.y0)[0]; // the M sits above the tag (a two-line tag can outweigh it)
  const mh = m.y1 - m.y0;
  const parts = comps.filter((c) => c === m || (c.n > m.n * 0.02 && c.y0 > m.y0 && c.y0 < m.y1 + mh * 1.2 && c.x1 > m.x0 - mh && c.x0 < m.x1 + mh));
  const print = new Uint8Array(W * H);
  const ids = new Set(parts.map((c) => c.id));
  for (let p = 0; p < W * H; p++) if (ids.has(lab[p])) print[p] = 1;
  const all = parts.reduce((a, c) => ({ x0: Math.min(a.x0, c.x0), x1: Math.max(a.x1, c.x1), y0: Math.min(a.y0, c.y0), y1: Math.max(a.y1, c.y1) }), { x0: 1e9, x1: -1, y0: 1e9, y1: -1 });
  const gap = parts.length;
  // mask: grow 3, fill holes inside the label box
  const R = 3, grown = new Uint8Array(W * H);
  for (let y = all.y0 - R; y <= all.y1 + R; y++) for (let x = all.x0 - R; x <= all.x1 + R; x++) {
    let hit = 0; for (let dy = -R; dy <= R && !hit; dy++) for (let dx = -R; dx <= R; dx++) { const q = (y + dy) * W + x + dx; if (print[q]) { hit = 1; break; } }
    if (hit) grown[y * W + x] = 1;
  }
  const bx0 = all.x0 - R - 2, bx1 = all.x1 + R + 2, by0 = all.y0 - R - 2, by1 = all.y1 + R + 2;
  const outside = new Uint8Array(W * H), stack = [];
  for (let x = bx0; x <= bx1; x++) { stack.push(by0 * W + x, by1 * W + x); }
  for (let y = by0; y <= by1; y++) { stack.push(y * W + bx0, y * W + bx1); }
  while (stack.length) { const q = stack.pop(); if (outside[q] || grown[q]) continue; const y = (q / W) | 0, x = q % W; if (x < bx0 || x > bx1 || y < by0 || y > by1) continue; outside[q] = 1; stack.push(q + 1, q - 1, q + W, q - W); }
  const mask = new Float32Array(W * H);
  for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) { const q = y * W + x; mask[q] = outside[q] ? 0 : 1; }
  // 1-px feather
  const f = new Float32Array(mask);
  for (let y = by0 + 1; y < by1; y++) for (let x = bx0 + 1; x < bx1; x++) { const q = y * W + x; f[q] = (mask[q] * 4 + mask[q - 1] + mask[q + 1] + mask[q - W] + mask[q + W]) / 8; }
  return { m, all, mask: f, box: { x0: bx0, x1: bx1, y0: by0, y1: by1 }, gap };
}

function eraseLabel(img, lab) {
  const { data, W } = img; const { x0, x1, y0, y1 } = lab.box;
  const ya = y0 - 12, yb = y1 + 12;
  for (let x = x0; x <= x1; x++) {
    const band = (yc) => { const v = [[], [], []]; for (let y = yc - 8; y <= yc + 8; y++) { const i = (y * W + x) * 4; for (let c = 0; c < 3; c++) v[c].push(data[i + c]); } return v.map((a) => a.sort((p, q) => p - q)[a.length >> 1]); };
    const A = band(ya - 8), B = band(yb + 8);
    for (let y = ya; y <= yb; y++) { const t = (y - ya) / (yb - ya), i = (y * W + x) * 4; if (data[i + 3] < 250) continue; for (let c = 0; c < 3; c++) data[i + c] = Math.round(A[c] * (1 - t) + B[c] * t); }
  }
}

(async () => {
  const ids = fs.readdirSync(`${D}/up`).filter((f) => f.endsWith(".png")).map((f) => f.replace(".png", ""));
  const master = await load(MASTER);
  const mLab = findLabel(master);
  const blank = { ...master, data: Buffer.from(master.data) };
  eraseLabel(blank, mLab);
  const mH = mLab.m.y1 - mLab.m.y0, mCx = (mLab.m.x0 + mLab.m.x1) / 2;
  const report = {};
  for (const id of ids) {
    const src = await load(id); const lab = findLabel(src);
    const s = mH / (lab.m.y1 - lab.m.y0);
    const out = Buffer.from(blank.data);
    const { x0, x1, y0, y1 } = lab.box;
    const srcCx = (lab.m.x0 + lab.m.x1) / 2;
    // map: dest (X,Y) <- src (srcCx + (X - mCx)/s, lab.m.y0 + (Y - mLab.m.y0)/s), bilinear
    const dx0 = Math.floor(mCx + (x0 - srcCx) * s), dx1 = Math.ceil(mCx + (x1 - srcCx) * s);
    const dy0 = Math.floor(mLab.m.y0 + (y0 - lab.m.y0) * s), dy1 = Math.ceil(mLab.m.y0 + (y1 - lab.m.y0) * s);
    const samp = (arr, W, fx, fy, c, stride) => { const xi = Math.floor(fx), yi = Math.floor(fy), ax = fx - xi, ay = fy - yi; const g = (x, y) => arr[(y * W + x) * stride + c]; return g(xi, yi) * (1 - ax) * (1 - ay) + g(xi + 1, yi) * ax * (1 - ay) + g(xi, yi + 1) * (1 - ax) * ay + g(xi + 1, yi + 1) * ax * ay; };
    for (let Y = dy0; Y <= dy1; Y++) for (let X = dx0; X <= dx1; X++) {
      const fx = srcCx + (X - mCx) / s, fy = lab.m.y0 + (Y - mLab.m.y0) / s;
      if (fx < x0 || fx >= x1 || fy < y0 || fy >= y1) continue;
      const a = samp(lab.mask, src.W, fx, fy, 0, 1); if (a <= 0) continue;
      const i = (Y * master.W + X) * 4; if (out[i + 3] < 250) continue;
      for (let c = 0; c < 3; c++) out[i + c] = Math.round(out[i + c] * (1 - a) + samp(src.data, src.W, fx, fy, c, 4) * a);
    }
    const png = await sharp(out, { raw: { width: master.W, height: master.H, channels: 4 } }).png().toBuffer();
    await sharp(png).toFile(`${D}/v4/hi/${id}.png`);
    await sharp(png).resize({ height: 840, kernel: "lanczos3" }).sharpen({ sigma: 0.5 }).png().toFile(`${D}/v4/final/${id}.png`);
    report[id] = { scale: +s.toFixed(3), gap: lab.gap, label: `${lab.all.x1 - lab.all.x0}x${lab.all.y1 - lab.all.y0}` };
  }
  console.log(JSON.stringify(report));
})();
