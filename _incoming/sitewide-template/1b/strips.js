// node strips.js <png> <outPrefix> <y0> <y1> [cols=4] — cut a tall full-page shot between y0..y1 into columns side by side (for eyeballing)
const sharp = require("sharp");
const [png, out, y0s, y1s, colsS] = process.argv.slice(2);
(async () => {
  const m = await sharp(png).metadata();
  const y0 = +y0s, y1 = Math.min(+y1s, m.height), cols = +(colsS || 4), h = Math.ceil((y1 - y0) / cols);
  const parts = [];
  for (let i = 0; i < cols; i++) {
    const top = y0 + i * h, hh = Math.min(h, y1 - top); if (hh <= 0) break;
    parts.push({ input: await sharp(png).extract({ left: 0, top, width: m.width, height: hh }).png().toBuffer(), left: i * (m.width + 20), top: 0 });
  }
  const big = await sharp({ create: { width: cols * (m.width + 20), height: h, channels: 3, background: "#f0f" } }).composite(parts).png().toBuffer();
  await sharp(big).resize({ height: Math.min(h, 1800) }).png().toFile(out);
})();
