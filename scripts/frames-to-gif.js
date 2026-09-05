// node assemble.js <framesdir> <out.gif|out.webp> <targetWidth> [everyNth=1]
const sharp = require("sharp"); const fs = require("fs"); const path = require("path");
const [dir, out, tw, nth = "1"] = process.argv.slice(2); const N = +nth;
(async () => {
  const log = JSON.parse(fs.readFileSync(path.join(dir, "frames.json"), "utf8")).filter((_, i) => i % N === 0);
  const files = log.map((f) => path.join(dir, `f${String(f.i).padStart(4, "0")}.jpg`));
  const meta = await sharp(files[0]).metadata(); const W = +tw; const H = Math.round((meta.height * W) / meta.width);
  const bufs = []; for (const f of files) bufs.push(await sharp(f).resize(W, H).png().toBuffer());
  const delays = log.map((f, i) => (i < log.length - 1 ? Math.max(20, log[i + 1].t - f.t) : 1200));
  const img = sharp(bufs, { join: { animated: true } });
  if (out.endsWith(".webp")) await img.webp({ quality: 80, delay: delays, loop: 0 }).toFile(out);
  else await img.gif({ delay: delays, loop: 0, colours: 128, effort: 7 }).toFile(out);
  const st = fs.statSync(out); console.log("wrote", out, `${W}x${H}`, "frames", bufs.length, "bytes", st.size, "total_ms", delays.reduce((a, b) => a + b, 0));
})().catch((e) => { console.error(e); process.exit(1); });
