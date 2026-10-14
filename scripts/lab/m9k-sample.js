/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/m9k/sample.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Sample each M Bar 9K flavour's print colours from SALTHUB's own flavour chart (salthub.com/m-bar-9k/, posters 02–06).
// Every flavour = the same black device; only the print (Salthub logo, BAR9K, M) changes colour, often as a gradient
// from top to bottom. For each device: find the black body, keep the bright pixels inside it (= the print), and average
// the brightest quarter in 6 bands from the Salthub logo (t=0) down to the M logo (t=1).
// usage (repo root): node _incoming/image-sitewide/m9k/sample.js  -> m9k/colours.json + m9k/colours-sheet.png
const sharp = require("sharp");
const fs = require("fs");
const D = "_incoming/image-sitewide";
const ROWS = [
  ["02", ["grape-aloe", "watermelon", "doublemint", "blue-ice", "strawberry"]],
  ["03", ["peach", "rainbow-candy", "grape-lychee", "apple-aloe", "mixberry"]],
  ["04", ["cola", "grape", "orange-sour", "sparkling-lemon", "sour-gummy"]],
  ["05", ["watermelon-bubblegum", "pink-berry", "peach-strawberry", "strawberry-milkshake", "menthol-freeze"]],
  ["06", ["kyoho-grape", "zapple"]],
];
const BANDS = 8;

(async () => {
  const out = {};
  const sheet = [];
  for (const [row, ids] of ROWS) {
    const { data, info } = await sharp(`${D}/src9k/m_bar_9k_${row}.webp`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height;
    const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
    const lum = (c) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
    // device body columns, measured once (near-black vertical runs; the same five columns on every row of the chart)
    const runs = [[139, 197], [339, 397], [539, 597], [739, 797], [929, 987]];
    ids.forEach((id, k) => {
      const [x0, x1] = runs[k];
      const xa = x0 + 3, xb = x1 - 3;
      // body rows: centre column mostly dark or bright print, bounded by the grey collar above and the grey band below
      const mid = (x0 + x1) >> 1;
      let yTop = -1, yBot = -1;
      const bright = [];
      for (let y = 0; y < H; y++) for (let x = xa; x <= xb; x++) {
        const c = px(x, y); const mx = Math.max(...c), mn = Math.min(...c);
        // print = bright AND inside the black body (both horizontal neighbours 4 px out are dark)
        if (mx > 90 && Math.max(...px(Math.max(x0, x - 6), y)) < 60 + 0 * mn && Math.max(...px(Math.min(x1, x + 6), y)) < 255) {
          const l = Math.max(...px(x0 + 1, y)), r = Math.max(...px(x1 - 1, y));
          if (l < 45 && r < 45) bright.push([x, y, c]);
        }
      }
      // the collar is bright across the whole body width; drop rows where more than 60% of the width is bright
      const perRow = {};
      for (const b of bright) perRow[b[1]] = (perRow[b[1]] || 0) + 1;
      const wide = new Set(Object.keys(perRow).filter((y) => perRow[y] > (xb - xa) * 0.6).map(Number));
      let pts = bright.filter((b) => !wide.has(b[1]));
      // keep the main vertical cluster (the print spans ~Salthub..M); drop stray points above the collar
      const ys = pts.map((p) => p[1]).sort((a, b) => a - b);
      const med = ys[ys.length >> 1];
      pts = pts.filter((p) => Math.abs(p[1] - med) < 90);
      // the print (Salthub top to M bottom) is the same height on every card (113-114 px); below it the grey band lines would
      // read as print, so the bottom is set from the top
      yTop = Math.min(...pts.map((p) => p[1])); yBot = yTop + 114; pts = pts.filter((p) => p[1] <= yBot);
      const bands = [];
      for (let b = 0; b < BANDS; b++) {
        const lo = yTop + ((yBot - yTop) * b) / BANDS, hi = yTop + ((yBot - yTop) * (b + 1)) / BANDS;
        const inb = pts.filter((p) => p[1] >= lo && p[1] <= hi).sort((a, c) => lum(c[2]) - lum(a[2]));
        const top = inb.slice(0, Math.max(3, Math.ceil(inb.length / 4)));
        const avg = [0, 1, 2].map((ch) => Math.round(top.reduce((a, p) => a + p[2][ch], 0) / top.length));
        bands.push(avg);
      }
      out[id] = { row, x: [x0, x1], y: [yTop, yBot], n: pts.length, bands };
      sheet.push({ id, row, x0, x1, yTop, yBot, bands });
    });
  }
  fs.writeFileSync(`${D}/m9k/colours.json`, JSON.stringify(out, null, 1));
  // sheet: for each flavour, the poster crop (3x) + the 6 sampled band colours
  const tiles = [];
  for (const t of sheet) {
    const crop = await sharp(`${D}/src9k/m_bar_9k_${t.row}.webp`).extract({ left: Math.max(0, t.x0 - 10), top: Math.max(0, t.yTop - 40), width: t.x1 - t.x0 + 20, height: t.yBot - t.yTop + 60 })
      .resize({ height: 300 }).png().toBuffer();
    const cm = await sharp(crop).metadata();
    const bandSvg = `<svg width="60" height="300">${t.bands.map((c, i) => `<rect y="${i * 50}" width="60" height="50" fill="rgb(${c})"/>`).join("")}</svg>`;
    tiles.push({ crop, cw: cm.width, band: Buffer.from(bandSvg), id: t.id });
  }
  const TW = 190, cols = 6, rows = Math.ceil(tiles.length / cols);
  const comps = [];
  tiles.forEach((t, i) => {
    const X = (i % cols) * TW, Y = Math.floor(i / cols) * 340;
    comps.push({ input: t.crop, left: X, top: Y });
    comps.push({ input: t.band, left: X + Math.min(t.cw, 120) + 4, top: Y });
    comps.push({ input: Buffer.from(`<svg width="${TW}" height="30"><text x="2" y="20" font-size="14" fill="#fff" font-family="Arial">${t.id}</text></svg>`), left: X, top: Y + 305 });
  });
  await sharp({ create: { width: cols * TW, height: rows * 340, channels: 3, background: "#333" } }).composite(comps).png().toFile(`${D}/m9k/colours-sheet.png`);
  console.log(Object.entries(out).map(([k, v]) => `${k} n=${v.n} y=${v.y}`).join("\n"));
})();
