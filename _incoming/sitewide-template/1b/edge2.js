// Zoom the real left/right body edge at mid height of each image (tilted or not), 4x nearest, on dark #111317 and magenta.
// node edge2.js <out.png> <files...>
const sharp = require("sharp");
const [out, ...files] = process.argv.slice(2);
(async () => {
  const tiles = []; const S = 60, Z = 4;
  for (const f of files) {
    const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const y = Math.floor(info.height / 2);
    let l = -1, r = -1;
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 128) { if (l < 0) l = x; r = x; }
    for (const cx of [l, r]) {
      const left = Math.max(0, Math.min(info.width - S, cx - S / 2)), top = Math.max(0, y - S / 2);
      const crop = await sharp(f).extract({ left, top, width: S, height: S }).resize(S * Z, S * Z, { kernel: "nearest" }).png().toBuffer();
      for (const bg of ["#111317", "#ff00ff"]) tiles.push(await sharp({ create: { width: S * Z, height: S * Z, channels: 3, background: bg } }).composite([{ input: crop }]).png().toBuffer());
    }
  }
  const per = 4, W = S * Z;
  await sharp({ create: { width: per * (W + 6), height: files.length * (W + 6), channels: 3, background: "#000" } })
    .composite(tiles.map((t, i) => ({ input: t, left: (i % per) * (W + 6), top: Math.floor(i / per) * (W + 6) }))).png().toFile(out);
})();
