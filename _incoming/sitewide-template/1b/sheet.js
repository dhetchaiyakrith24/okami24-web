// Contact sheet: node sheet.js out.png bg(#hex) file1 file2 ... (each tile 600x600 contain)
const sharp = require("sharp");
const [out, bg, ...files] = process.argv.slice(2);
(async () => {
  const T = 600, cols = Math.min(3, files.length), rows = Math.ceil(files.length / cols);
  const comps = [];
  for (let i = 0; i < files.length; i++) {
    const buf = await sharp(files[i]).resize(T - 20, T - 40, { fit: "contain", background: bg }).flatten({ background: bg }).png().toBuffer();
    const label = Buffer.from(`<svg width="${T}" height="30"><text x="10" y="20" font-size="16" fill="#f0f" font-family="Arial">${files[i].split("/").pop()}</text></svg>`);
    comps.push({ input: buf, left: (i % cols) * T + 10, top: Math.floor(i / cols) * T + 30 }, { input: label, left: (i % cols) * T, top: Math.floor(i / cols) * T });
  }
  await sharp({ create: { width: cols * T, height: rows * T, channels: 3, background: bg } }).composite(comps).png().toFile(out);
})();
